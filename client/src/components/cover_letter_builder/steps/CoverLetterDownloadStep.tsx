import { useState } from "react";
import { useCoverLetter } from "@/lib/coverLetterContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, FileType, File, Loader2, Check, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface CoverLetterDownloadStepProps {
  onBack: () => void;
}

type DownloadFormat = "pdf" | "docx" | "txt";

export function CoverLetterDownloadStep({ onBack }: CoverLetterDownloadStepProps) {
  const { coverLetterData } = useCoverLetter();
  const { toast } = useToast();
  const [downloadedFormats, setDownloadedFormats] = useState<DownloadFormat[]>([]);

  const downloadMutation = useMutation({
    mutationFn: async (format: DownloadFormat) => {
      // TODO: Implement actual API request for downloading cover letter
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      // return { blob: new Blob(["Cover letter content for " + format], { type: "text/plain" }), format };

      const response = await apiRequest("POST", `/api/download/cover-letter/${format}`, coverLetterData);
      const blob = await response.blob();
      return { blob, format };
    },
    onSuccess: ({ blob, format }) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      let ext = "txt";
      if (format === "pdf") {
        ext = "pdf";
      } else if (format === "docx") {
        ext = "docx";
      }
      a.download = `${coverLetterData.senderInfo?.firstName || "CoverLetter"}_${coverLetterData.senderInfo?.lastName || ""}_CoverLetter.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setDownloadedFormats((prev) => [...prev, format]);
      toast({
        title: "Download started!",
        description: `Your cover letter is being downloaded as a ${format.toUpperCase()} file.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Download failed",
        description: error.message || "There was an error downloading your cover letter. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formats: { id: DownloadFormat; name: string; description: string; icon: typeof FileText; popular?: boolean }[] = [
    {
      id: "pdf",
      name: "PDF Document",
      description: "A professional PDF document, ready for printing or digital submission.",
      icon: FileText,
      popular: true,
    },
    {
      id: "docx",
      name: "Word Document",
      description: "An editable DOCX file, compatible with Microsoft Word and other word processors.",
      icon: FileText,
    },
    {
      id: "txt",
      name: "Plain Text",
      description: "Simple text format for copy-pasting into online forms or basic editing.",
      icon: File,
    },
  ];

  const isComplete = coverLetterData.senderInfo?.firstName && coverLetterData.senderInfo?.lastName && coverLetterData.body;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Download Your Cover Letter</h2>
        <p className="text-gray-600 mt-1">
          Your cover letter is ready! Choose a format to download.
        </p>
      </div>

      {!isComplete && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-800">
            Please ensure your sender information and cover letter body are filled out before downloading.
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
              data-testid={`card-cl-download-${format.id}`}
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
                  data-testid={`button-cl-download-${format.id}`}
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

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2" data-testid="button-back-cl-download">
          <ArrowLeft className="w-4 h-4" />
          Back to Template
        </Button>
        <Link href="/">
          <Button variant="outline" data-testid="button-finish-cl">
            Finish & Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
