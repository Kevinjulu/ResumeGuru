import { Router, Request, Response } from 'express';
import multer from 'multer';
import mammoth from 'mammoth';
import pdf from 'pdf-parse'; // Import pdf-parse
import { ResumeData } from '../shared/schema.ts'; // Assuming ResumeData is defined here

const uploadRouter = Router();
const upload = multer(); // Configure multer for in-memory storage

// Helper function to extract basic info from parsed text
function extractResumeData(text: string): Partial<ResumeData> {
    const extracted: Partial<ResumeData> = {};

    // --- Contact Info ---
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
    if (emailMatch) {
        extracted.contactInfo = { ...extracted.contactInfo, email: emailMatch[0] };
    }
    const phoneMatch = text.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
    if (phoneMatch) {
        extracted.contactInfo = { ...extracted.contactInfo, phone: phoneMatch[0] };
    }
    // More complex regex for name, linkedin, etc., would go here.
    // For now, let's just get the first line as a potential name
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length > 0) {
        const potentialName = lines[0].split(' ').map(s => s.trim()).filter(Boolean);
        if (potentialName.length >= 2) {
            extracted.contactInfo = { ...extracted.contactInfo, firstName: potentialName[0], lastName: potentialName.slice(1).join(' ') };
        } else {
            extracted.contactInfo = { ...extracted.contactInfo, firstName: potentialName[0] };
        }
    }


    // --- Summary ---
    const summaryKeywords = /(summary|profile|objective)/i;
    const summaryMatch = text.match(new RegExp(`(?:${summaryKeywords.source})\s*\n\s*([\s\S]*?)(?:\n\n[A-Z].*|$`, 'i'));
    if (summaryMatch && summaryMatch[1]) {
        // Take a few sentences or up to a new section
        extracted.summary = summaryMatch[1].split('\n').filter(Boolean).slice(0, 3).join(' ').trim();
        if (extracted.summary.length > 500) extracted.summary = extracted.summary.substring(0, 500) + '...';
    }


    // --- Experience ---
    const experienceSectionMatch = text.match(/(work experience|experience|employment history)\s*(\n[\s\S]*?)(\n[A-Z][a-zA-Z\s]+:|\n[A-Z][a-zA-Z\s]+(?:\sSection)?\n\n|$)/i);
    if (experienceSectionMatch && experienceSectionMatch[2]) {
        const expText = experienceSectionMatch[2];
        const jobEntries = expText.split(/\n\s*(?=["\dA-Z][a-zA-Z\s,.]+?\s(?:at|in)\s["\dA-Z])/).filter(Boolean); // Attempt to split by new job title
        extracted.experiences = jobEntries.map((entry, index) => {
            const jobTitleMatch = entry.match(/^(.+?)(?:\s(?:at|in)\s(.+?))?(\s\d{4}[^\n]*)?\n?/i);
            const companyMatch = entry.match(/(at|in)\s(.+?)(?:\s-\s|\n)/i); // Simplified for now
            const dateMatch = entry.match(/(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}\s-\s(?:Present|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4})|\d{4}\s-\s\d{4}|\d{4})\b/);

            const bullets = entry.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•')).map(line => line.trim().substring(1).trim());

            return {
                id: `exp-${index}`,
                jobTitle: jobTitleMatch?.[1]?.trim() || `Job Title ${index + 1}`,
                company: companyMatch?.[2]?.trim() || `Company ${index + 1}`,
                startDate: dateMatch?.[1]?.split(' - ')[0] || 'YYYY-MM-DD',
                endDate: dateMatch?.[1]?.split(' - ')[1] || 'YYYY-MM-DD',
                current: dateMatch?.[1]?.includes('Present') || false,
                description: '', // Can be improved
                bullets: bullets.length > 0 ? bullets : [],
            };
        });
    }

    // --- Education ---
    const educationSectionMatch = text.match(/(education|academic background)\s*(\n[\s\S]*?)(\n[A-Z][a-zA-Z\s]+:|\n[A-Z][a-zA-Z\s]+(?:\sSection)?\n\n|$)/i);
    if (educationSectionMatch && educationSectionMatch[2]) {
        const eduText = educationSectionMatch[2];
        const eduEntries = eduText.split(/\n\s*(?=["\dA-Z][a-zA-Z\s,.]+?\s(?:University|College|Institute))/).filter(Boolean); // Split by institution
        extracted.education = eduEntries.map((entry, index) => {
            const degreeMatch = entry.match(/^(.+?)(?:\sfrom\s(.+?))?(\s\d{4}[^\n]*)?\n?/i);
            const schoolMatch = entry.match(/(University|College|Institute)[\s\S]*?(?=\d{4}|$)/i);
            const gradDateMatch = a.match(/(\b\d{4}\b)/);

            return {
                id: `edu-${index}`,
                degree: degreeMatch?.[1]?.trim() || `Degree ${index + 1}`,
                school: schoolMatch?.[0]?.trim() || `School ${index + 1}`,
                graduationDate: gradDateMatch?.[1] || 'YYYY-MM-DD',
                // location: '', // Can be improved
            };
        });
    }

    // --- Skills ---
    const skillsSectionMatch = text.match(/(skills|technical skills|proficiencies)\s*(\n[\s\S]*?)(\n[A-Z][a-zA-Z\s]+:|\n[A-Z][a-zA-Z\s]+(?:\sSection)?\n\n|$)/i);
    if (skillsSectionMatch && skillsSectionMatch[2]) {
        const skillsText = skillsSectionMatch[2].replace(/\n/g, ', ').replace(/\s{2,}/g, ' ');
        const skillList = skillsText.split(',').map(s => s.trim()).filter(Boolean);
        extracted.skills = skillList.map((s, index) => ({ id: `skill-${index}`, name: s, level: 'intermediate' }));
    }
    
    return extracted;
}


uploadRouter.post('/parse-resume', upload.single('resumeFile'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const fileBuffer = req.file.buffer;
    const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase();

    let parsedText: string = '';

    try {
        if (fileExtension === 'docx') {
            const result = await mammoth.extractRawText({ buffer: fileBuffer });
            parsedText = result.value; // The raw text
        } else if (fileExtension === 'pdf') {
            const data = await pdf(fileBuffer);
            parsedText = data.text;
        } else {
            return res.status(400).send('Unsupported file type. Only DOCX and PDF are supported.');
        }

        const resumeData = extractResumeData(parsedText);
        res.json(resumeData);

    } catch (error) {
        console.error('Error parsing resume file:', error);
        res.status(500).send('Error processing resume file.');
    }
});

export default uploadRouter;
