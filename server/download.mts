import { Router, Request, Response } from 'express';
import { ResumeData } from '../shared/schema';
import puppeteer from 'puppeteer';
import { Document, Paragraph, TextRun, Packer, SectionBreak, HeadingLevel, AlignmentType } from 'docx'; // Import DOCX modules
import { templateColors, CoverLetterData } from '../shared/schema'; // Assuming templateColors is needed for dynamic styling
import { type ResumeData } from '../shared/schema';

const downloadRouter = Router();

// Helper function to render a resume into HTML on the server
async function renderResumeToHtml(resumeData: ResumeData): Promise<string> {
    const contactInfo = resumeData.contactInfo || {};
    const summary = resumeData.summary || '';
    const experiences = resumeData.experiences || [];
    const education = resumeData.education || [];
    const skills = resumeData.skills || [];
    const certifications = resumeData.certifications || [];
    const primaryColor = templateColors.find(c => c.id === resumeData.colorId)?.hex || '#3b82f6'; // Use selected color, fallback to blue

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Resume - ${contactInfo.firstName || ''} ${contactInfo.lastName || ''}</title>
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
                .container { max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                h1 { color: #000; font-size: 2.5em; margin-bottom: 0.2em; text-align: center; }
                .contact-info { font-size: 0.9em; margin-bottom: 1.5em; text-align: center; }
                .contact-info span { margin: 0 5px; }
                h2 { font-size: 1.5em; border-bottom: 2px solid ${primaryColor}; padding-bottom: 5px; margin-top: 1.5em; margin-bottom: 1em; color: ${primaryColor}; }
                .section-content { margin-left: 10px; }
                .job-title, .degree { font-weight: bold; }
                .company, .school { font-style: italic; }
                ul { list-style-type: disc; margin-left: 20px; }
                ul.skills { list-style-type: none; display: flex; flex-wrap: wrap; gap: 10px; margin-left: 0; }
                ul.skills li { background: #eee; padding: 5px 10px; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${contactInfo.firstName || 'First'} ${contactInfo.lastName || 'Last'}</h1>
                <div class="contact-info">
                    ${contactInfo.phone ? `<span>${contactInfo.phone}</span>` : ''}
                    ${contactInfo.email ? `<span>${contactInfo.email}</span>` : ''}
                    ${contactInfo.linkedin ? `<span>${contactInfo.linkedin}</span>` : ''}
                    ${contactInfo.website ? `<span>${contactInfo.website}</span>` : ''}
                </div>

                ${summary ? `<h2>Summary</h2><p>${summary}</p>` : ''}

                ${experiences.length > 0 ? `<h2>Experience</h2>
                    <div class="section-content">
                        ${experiences.map(exp => `
                            <div style="margin-bottom: 1em;">
                                <div class="job-title">${exp.jobTitle}</div>
                                <div class="company">${exp.company} | ${exp.location}</div>
                                <div class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
                                ${exp.description ? `<p>${exp.description}</p>` : ''}
                                ${exp.bullets && exp.bullets.length > 0 ? `<ul>${exp.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
                            </div>
                        `).join('')}
                    </div>` : ''}

                ${education.length > 0 ? `<h2>Education</h2>
                    <div class="section-content">
                        ${education.map(edu => `
                            <div style="margin-bottom: 1em;">
                                <div class="degree">${edu.degree}</div>
                                <div class="school">${edu.school} | ${edu.location}</div>
                                <div class="date">${edu.graduationDate}</div>
                            </div>
                        `).join('')}
                    </div>` : ''}
                
                ${skills.length > 0 ? `<h2>Skills</h2>
                    <ul class="skills">
                        ${skills.map(skill => `<li>${skill.name} (${skill.level})</li>`).join('')}
                    </ul>` : ''}

                ${certifications.length > 0 ? `<h2>Certifications</h2>
                    <div class="section-content">
                        ${certifications.map(cert => `
                            <div style="margin-bottom: 1em;">
                                <div class="degree">${cert.name}</div>
                                <div class="school">${cert.issuer}</div>
                                <div class="date">${cert.date}</div>
                            </div>
                        `).join('')}
                    </div>` : ''}
            </div>
        </body>
        </html>
    `;
}

downloadRouter.post('/pdf', async (req: Request, res: Response) => {
    const resumeData: ResumeData = req.body;

    if (!resumeData) {
        return res.status(400).send('Resume data is required');
    }

    try {
        const htmlContent = await renderResumeToHtml(resumeData);

        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${resumeData.contactInfo?.firstName || 'resume'}-${resumeData.contactInfo?.lastName || 'document'}.pdf"`,
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

downloadRouter.post('/docx', async (req: Request, res: Response) => {
    const resumeData: ResumeData = req.body;

    if (!resumeData) {
        return res.status(400).send('Resume data is required');
    }

    const { contactInfo, summary, experiences, education, skills, certifications } = resumeData;
    const primaryColor = templateColors.find(c => c.id === resumeData.colorId)?.hex || '#3b82f6';

    const children: (Paragraph | SectionBreak)[] = [];

    // Contact Info
    children.push(new Paragraph({
        children: [
            new TextRun({ text: `${contactInfo?.firstName || 'First'} ${contactInfo?.lastName || 'Last'}`, size: 50, bold: true, color: '000000' }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
    }));
    const contactChildren: TextRun[] = [];
    if (contactInfo?.phone) contactChildren.push(new TextRun({ text: contactInfo.phone, color: '666666', size: 20 }), new TextRun({ text: ' | ', color: '666666', size: 20 }));
    if (contactInfo?.email) contactChildren.push(new TextRun({ text: contactInfo.email, color: '666666', size: 20 }), new TextRun({ text: ' | ', color: '666666', size: 20 }));
    if (contactInfo?.linkedin) contactChildren.push(new TextRun({ text: contactInfo.linkedin, color: '666666', size: 20 }), new TextRun({ text: ' | ', color: '666666', size: 20 }));
    if (contactInfo?.website) contactChildren.push(new TextRun({ text: contactInfo.website, color: '666666', size: 20 }));
    if (contactChildren.length > 0) {
        // Remove trailing " | " if present
        if (contactChildren[contactChildren.length - 1].getText() === ' | ') {
            contactChildren.pop();
        }
        children.push(new Paragraph({
            children: contactChildren,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
        }));
    }

    // Summary
    if (summary) {
        children.push(new Paragraph({
            text: 'Summary',
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
            border: { bottom: { color: primaryColor.replace('#', ''), size: 8, style: 'single' } },
            spacing: { before: 200, after: 100 },
            alignment: AlignmentType.LEFT,
        }));
        children.push(new Paragraph({
            text: summary,
            spacing: { after: 200 },
        }));
    }

    // Experience
    if (experiences && experiences.length > 0) {
        children.push(new Paragraph({
            text: 'Experience',
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
            border: { bottom: { color: primaryColor.replace('#', ''), size: 8, style: 'single' } },
            spacing: { before: 200, after: 100 },
            alignment: AlignmentType.LEFT,
        }));
        experiences.forEach(exp => {
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: exp.jobTitle || '', bold: true }),
                    new TextRun({ text: ` at ${exp.company || ''}`, bold: true, color: primaryColor.replace('#', '') }),
                    new TextRun({ text: ` | ${exp.location || ''}`, bold: true }),
                ],
                spacing: { after: 50 },
            }));
            children.push(new Paragraph({
                text: `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`,
                spacing: { after: 100 },
            }));
            if (exp.bullets && exp.bullets.length > 0) {
                exp.bullets.forEach(bullet => {
                    children.push(new Paragraph({
                        text: bullet,
                        bullet: { level: 0 },
                    }));
                });
                children.push(new Paragraph({ spacing: { after: 200 } })); // Add space after bullets
            } else {
                children.push(new Paragraph({ spacing: { after: 200 } }));
            }
        });
    }

    // Education
    if (education && education.length > 0) {
        children.push(new Paragraph({
            text: 'Education',
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
            border: { bottom: { color: primaryColor.replace('#', ''), size: 8, style: 'single' } },
            spacing: { before: 200, after: 100 },
            alignment: AlignmentType.LEFT,
        }));
        education.forEach(edu => {
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: edu.degree || '', bold: true }),
                    new TextRun({ text: ` from ${edu.school || ''}`, bold: true, color: primaryColor.replace('#', '') }),
                    new TextRun({ text: ` | ${edu.location || ''}`, bold: true }),
                ],
                spacing: { after: 50 },
            }));
            if (edu.graduationDate) {
                children.push(new Paragraph({
                    text: `Graduated: ${edu.graduationDate}`,
                    spacing: { after: 100 },
                }));
            } else {
                children.push(new Paragraph({ spacing: { after: 100 } }));
            }
        });
    }

    // Skills
    if (skills && skills.length > 0) {
        children.push(new Paragraph({
            text: 'Skills',
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
            border: { bottom: { color: primaryColor.replace('#', ''), size: 8, style: 'single' } },
            spacing: { before: 200, after: 100 },
            alignment: AlignmentType.LEFT,
        }));
        const skillTextRuns: TextRun[] = [];
        skills.forEach((skill, index) => {
            skillTextRuns.push(new TextRun({ text: `${skill.name || ''}`, bold: true }));
            if (skill.level) {
                skillTextRuns.push(new TextRun({ text: ` (${skill.level})` }));
            }
            if (index < skills.length - 1) {
                skillTextRuns.push(new TextRun({ text: ', ' }));
            }
        });
        children.push(new Paragraph({
            children: skillTextRuns,
            spacing: { after: 200 },
        }));
    }

    // Certifications
    if (certifications && certifications.length > 0) {
        children.push(new Paragraph({
            text: 'Certifications',
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
            border: { bottom: { color: primaryColor.replace('#', ''), size: 8, style: 'single' } },
            spacing: { before: 200, after: 100 },
            alignment: AlignmentType.LEFT,
        }));
        certifications.forEach(cert => {
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: cert.name || '', bold: true }),
                    new TextRun({ text: ` by ${cert.issuer || ''}`, bold: true, color: primaryColor.replace('#', '') }),
                ],
                spacing: { after: 50 },
            }));
            if (cert.date) {
                children.push(new Paragraph({
                    text: `Date: ${cert.date}`,
                    spacing: { after: 100 },
                }));
            } else {
                children.push(new Paragraph({ spacing: { after: 100 } }));
            }
        });
    }

    const doc = new Document({
        sections: [{
            children: children,
        }],
    });

    try {
        const buffer = await Packer.toBuffer(doc);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${contactInfo?.firstName || 'resume'}-${contactInfo?.lastName || 'document'}.docx"`,
        });
        res.send(buffer);
    } catch (error) {
        console.error('Error generating DOCX:', error);
        res.status(500).send('Error generating DOCX');
    }
    res.set({
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${resumeData.contactInfo?.firstName || 'resume'}-${resumeData.contactInfo?.lastName || 'document'}.txt"`,
    });
    res.send(textContent);
});

// Helper function to render a cover letter into HTML on the server
async function renderCoverLetterToHtml(coverLetterData: CoverLetterData): Promise<string> {
    const { senderInfo, recipientInfo, date, subject, body } = coverLetterData;
    const primaryColor = templateColors.find(c => c.id === coverLetterData.colorId)?.hex || '#3b82f6';

    const senderAddress = [senderInfo?.address, senderInfo?.city, senderInfo?.state, senderInfo?.zipCode].filter(Boolean).join(', ');
    const recipientAddress = [recipientInfo?.address, recipientInfo?.city, recipientInfo?.state, recipientInfo?.zipCode].filter(Boolean).join(', ');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cover Letter - ${senderInfo?.firstName || ''} ${senderInfo?.lastName || ''}</title>
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; font-size: 11pt; }
                .container { max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                .sender-info, .recipient-info { margin-bottom: 1.5em; }
                .sender-info p, .recipient-info p { margin: 0; }
                .date { text-align: right; margin-bottom: 1.5em; }
                .subject { font-weight: bold; margin-bottom: 1em; }
                .body p { margin-bottom: 1em; }
                .closing { margin-top: 2em; }
                .closing p { margin: 0; }
                .signature { margin-top: 0.5em; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="sender-info">
                    <p class="font-bold" style="color: ${primaryColor};">${senderInfo?.firstName} ${senderInfo?.lastName}</p>
                    <p>${senderInfo?.email}</p>
                    <p>${senderInfo?.phone}</p>
                    <p>${senderAddress}</p>
                </div>

                <p class="date">${date}</p>

                <div class="recipient-info">
                    ${recipientInfo?.name ? `<p class="font-bold">${recipientInfo.name}</p>` : ''}
                    ${recipientInfo?.title ? `<p>${recipientInfo.title}</p>` : ''}
                    ${recipientInfo?.company ? `<p>${recipientInfo.company}</p>` : ''}
                    <p>${recipientAddress}</p>
                </div>

                ${subject ? `<p class="subject">Subject: ${subject}</p>` : ''}
                
                <p>Dear ${recipientInfo?.name || 'Hiring Manager'},</p>

                <div class="body">
                    ${body ? body.split('\n').map(p => `<p>${p}</p>`).join('') : '<p>Your cover letter body will appear here.</p>'}
                </div>

                <div class="closing">
                    <p>Sincerely,</p>
                    <p class="signature">${senderInfo?.firstName} ${senderInfo?.lastName}</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function generateCoverLetterPlainText(coverLetterData: CoverLetterData): string {
    const { senderInfo, recipientInfo, date, subject, body } = coverLetterData;

    let text = "";

    // Sender Info
    text += `${senderInfo?.firstName || ''} ${senderInfo?.lastName || ''}\n`;
    text += `${senderInfo?.email || ''}\n`;
    text += `${senderInfo?.phone || ''}\n`;
    text += [senderInfo?.address, senderInfo?.city, senderInfo?.state, senderInfo?.zipCode].filter(Boolean).join(', ') + '\n\n';

    // Date
    text += `${date || ''}\n\n`;

    // Recipient Info
    text += `${recipientInfo?.name || ''}\n`;
    if (recipientInfo?.title) text += `${recipientInfo.title}\n`;
    if (recipientInfo?.company) text += `${recipientInfo.company}\n`;
    text += [recipientInfo?.address, recipientInfo?.city, recipientInfo?.state, recipientInfo?.zipCode].filter(Boolean).join(', ') + '\n\n';

    // Subject
    if (subject) text += `Subject: ${subject}\n\n`;

    text += `Dear ${recipientInfo?.name || 'Hiring Manager'},\n\n`;

    // Body
    text += (body || '') + '\n\n';

    // Closing
    text += `Sincerely,\n\n${senderInfo?.firstName || ''} ${senderInfo?.lastName || ''}\n`;

    return text;
}

// Cover Letter Endpoints
downloadRouter.post('/cover-letter/pdf', async (req: Request, res: Response) => {
    const coverLetterData: CoverLetterData = req.body;

    if (!coverLetterData) {
        return res.status(400).send('Cover letter data is required');
    }

    try {
        const htmlContent = await renderCoverLetterToHtml(coverLetterData);

        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${coverLetterData.senderInfo?.firstName || 'cover_letter'}-${coverLetterData.senderInfo?.lastName || 'document'}.pdf"`,
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating Cover Letter PDF:', error);
        res.status(500).send('Error generating Cover Letter PDF');
    }
});

downloadRouter.post('/cover-letter/docx', async (req: Request, res: Response) => {
    const coverLetterData: CoverLetterData = req.body;

    if (!coverLetterData) {
        return res.status(400).send('Cover letter data is required');
    }

    const { senderInfo, recipientInfo, date, subject, body } = coverLetterData;
    const primaryColor = templateColors.find(c => c.id === coverLetterData.colorId)?.hex || '#3b82f6';

    const children: Paragraph[] = [];

    // Sender Info
    children.push(new Paragraph({
        children: [
            new TextRun({ text: `${senderInfo?.firstName || 'First'} ${senderInfo?.lastName || 'Last'}`, size: 24, bold: true, color: primaryColor.replace('#', '') }),
        ],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 100 },
    }));
    if (senderInfo?.email) children.push(new Paragraph({ text: senderInfo.email, alignment: AlignmentType.RIGHT }));
    if (senderInfo?.phone) children.push(new Paragraph({ text: senderInfo.phone, alignment: AlignmentType.RIGHT }));
    const senderAddress = [senderInfo?.address, senderInfo?.city, senderInfo?.state, senderInfo?.zipCode].filter(Boolean).join(', ');
    if (senderAddress) children.push(new Paragraph({ text: senderAddress, alignment: AlignmentType.RIGHT }));
    children.push(new Paragraph({ spacing: { after: 200 } })); // Spacer

    // Date
    if (date) children.push(new Paragraph({ text: date, alignment: AlignmentType.RIGHT, spacing: { after: 200 } }));

    // Recipient Info
    if (recipientInfo?.name) children.push(new Paragraph({ text: recipientInfo.name, bold: true }));
    if (recipientInfo?.title) children.push(new Paragraph({ text: recipientInfo.title }));
    if (recipientInfo?.company) children.push(new Paragraph({ text: recipientInfo.company }));
    const recipientAddress = [recipientInfo?.address, recipientInfo?.city, recipientInfo?.state, recipientInfo?.zipCode].filter(Boolean).join(', ');
    if (recipientAddress) children.push(new Paragraph({ text: recipientAddress }));
    children.push(new Paragraph({ spacing: { after: 200 } })); // Spacer

    // Subject
    if (subject) children.push(new Paragraph({ text: `Subject: ${subject}`, bold: true, spacing: { after: 200 } }));

    // Salutation
    children.push(new Paragraph({ text: `Dear ${recipientInfo?.name || 'Hiring Manager'},`, spacing: { after: 200 } }));

    // Body
    if (body) {
        body.split('\n').forEach(paragraphText => {
            children.push(new Paragraph({ text: paragraphText, spacing: { after: 200 } }));
        });
    }

    // Closing
    children.push(new Paragraph({ text: 'Sincerely,', spacing: { before: 400, after: 100 } }));
    children.push(new Paragraph({ text: `${senderInfo?.firstName || ''} ${senderInfo?.lastName || ''}`, bold: true }));

    const doc = new Document({
        sections: [{
            children: children,
        }],
    });

    try {
        const buffer = await Packer.toBuffer(doc);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${senderInfo?.firstName || 'cover_letter'}-${senderInfo?.lastName || 'document'}.docx"`,
        });
        res.send(buffer);
    } catch (error) {
        console.error('Error generating Cover Letter DOCX:', error);
        res.status(500).send('Error generating Cover Letter DOCX');
    }
});

downloadRouter.post('/cover-letter/txt', async (req: Request, res: Response) => {
    const coverLetterData: CoverLetterData = req.body;
    const textContent = generateCoverLetterPlainText(coverLetterData);

    res.set({
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${coverLetterData.senderInfo?.firstName || 'cover_letter'}-${coverLetterData.senderInfo?.lastName || 'document'}.txt"`,
    });
    res.send(textContent);
});

export default downloadRouter;
