import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useResume } from "@/lib/resumeContext";
import { useToast } from "@/hooks/use-toast";

interface UploadStepProps {
  onNext: () => void;
  documentType: "resume" | "cv";
}

export function UploadStep({ onNext, documentType }: UploadStepProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { resumeData, setResumeData } = useResume();
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('resumeFile', file);

    try {
      const response = await fetch('/api/upload/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume.');
      }

      const parsedResumeData = await response.json();
      
      // Merge parsed data with existing template/color/section order
      setResumeData({
        ...resumeData, // Keep existing values that might not be in parsed data
        ...parsedResumeData,
        templateId: resumeData.templateId, // Ensure template and color are preserved from context
        colorId: resumeData.colorId,
        sectionOrder: resumeData.sectionOrder,
      });

      toast({
        title: "Upload successful!",
        description: "Your document has been processed and details extracted.",
      });
      onNext(); // Proceed to the next step
    } catch (error) {
      console.error("Error uploading or parsing file:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was an error processing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Upload Your Existing {documentType === "cv" ? "CV" : "Resume"}</h2>
        <p className="text-gray-600 mt-1">
          Upload a PDF or DOCX file to automatically extract your information.
        </p>
      </div>

      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragOver ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <FileUp className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-700 mb-2">Drag & drop your {documentType} here, or</p>
          <Label htmlFor="file-upload" className="cursor-pointer text-primary hover:underline">
            Browse to upload
          </Label>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {file && <p className="mt-4 text-sm text-gray-600">Selected file: <span className="font-medium">{file.name}</span></p>}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          onClick={handleUpload} 
          disabled={!file || isLoading}
          data-testid="button-upload-file"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Process {documentType === "cv" ? "CV" : "Resume"}
        </Button>
        <Button type="button" variant="outline" onClick={onNext}>
          Skip & Build New
        </Button>
      </div>
    </div>
  );
}
