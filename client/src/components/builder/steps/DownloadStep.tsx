import { useState } from "react";
import { useResume } from "@/lib/resumeContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, FileType, File, Loader2, Check, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface DownloadStepProps {
  onBack: () => void;
}

type DownloadFormat = "pdf" | "docx" | "txt";

export function DownloadStep({ onBack }: DownloadStepProps) {
  const { resumeData } = useResume();
  const { toast } = useToast();
  const [downloadedFormats, setDownloadedFormats] = useState<DownloadFormat[]>([]);

  const downloadMutation = useMutation({
    mutationFn: async (format: DownloadFormat) => {
      const response = await apiRequest("POST", `/api/download/${format}`, resumeData);
      const blob = await response.blob();
      return { blob, format };
    },
    onSuccess: ({ blob, format }) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = format === "pdf" ? "html" : "txt";
      a.download = `${resumeData.contactInfo?.firstName || "Resume"}_${resumeData.contactInfo?.lastName || ""}_Resume.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setDownloadedFormats((prev) => [...prev, format]);
      const formatName = format === "pdf" ? "HTML (print to PDF)" : format === "docx" ? "Text" : "TXT";
      toast({
        title: "Download started!",
        description: `Your resume is being downloaded. ${format === "pdf" ? "Open the file and print to PDF." : ""}`,
      });
    },
    onError: () => {
      toast({
        title: "Download failed",
        description: "There was an error downloading your resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formats: { id: DownloadFormat; name: string; description: string; icon: typeof FileText; popular?: boolean }[] = [
    {
      id: "pdf",
      name: "HTML (Print to PDF)",
      description: "Downloads as HTML. Open in browser and use Print > Save as PDF for best results.",
      icon: FileText,
      popular: true,
    },
    {
      id: "docx",
      name: "Text Document",
      description: "Plain text format that can be opened in Word or any text editor.",
      icon: FileType,
    },
    {
      id: "txt",
      name: "Plain Text",
      description: "Simple text format for copy-pasting into online forms.",
      icon: File,
    },
  ];

  const isComplete = resumeData.contactInfo?.firstName && resumeData.contactInfo?.lastName;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Download Your Resume</h2>
        <p className="text-gray-600 mt-1">
          Your resume is ready! Choose a format to download.
        </p>
      </div>

      {!isComplete && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-800">
            Please fill in at least your first and last name in the Contact Information section before downloading.
          </p>
        </Card>
      )}

      <div className="grid gap-4">
        {formats.map((format) => {
          const isDownloaded = downloadedFormats.includes(format.id);
          const isLoading = downloadMutation.isPending && downloadMutation.variables === format.id;

          return (
            <Card
              key={format.id}
              className={`p-4 transition-all ${
                isDownloaded ? "bg-green-50 border-green-200" : "hover:border-primary/30"
              }`}
              data-testid={`card-download-${format.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDownloaded ? "bg-green-100" : "bg-primary/10"
                  }`}>
                    {isDownloaded ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <format.icon className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{format.name}</h3>
                      {format.popular && (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          Most Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{format.description}</p>
                  </div>
                </div>
                <Button
                  onClick={() => downloadMutation.mutate(format.id)}
                  disabled={!isComplete || isLoading}
                  className="gap-2"
                  data-testid={`button-download-${format.id}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : isDownloaded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-blue-50 border-primary/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Want more features?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upgrade to Pro for unlimited resumes, all templates, AI-powered features, and more.
            </p>
            <Link href="/pricing">
              <Button variant="outline" size="sm" data-testid="button-upgrade">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2" data-testid="button-back-download">
          <ArrowLeft className="w-4 h-4" />
          Back to Templates
        </Button>
        <Link href="/">
          <Button variant="outline" data-testid="button-finish">
            Finish & Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
