import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link, useLocation } from "wouter";
import { Loader } from "@/components/common/Loader";
import { PlusCircle, FileText, Trash2, Edit, Copy } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useUser } from "@/hooks/use-user";
import { Badge } from "@/components/ui/badge";

interface ResumeItem {
  id: string;
  title: string;
  templateId: string;
  colorId: string;
  createdAt: string;
  data: any; // Raw resume data
}

export default function MyResumes() {
  const { user, isLoading: authLoading } = useUser();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data: resumes, isLoading: resumesLoading } = useQuery<ResumeItem[]>({
    queryKey: ["resumes"],
    queryFn: async () => {
      const res = await fetch("/api/resumes");
      if (!res.ok) throw new Error("Failed to fetch resumes");
      return res.json();
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete resume");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast({
        title: "Resume Deleted",
        description: "Your resume has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete resume.",
        variant: "destructive",
      });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (resume: ResumeItem) => {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${resume.title} (Copy)`,
          data: resume.data,
          templateId: resume.templateId,
          colorId: resume.colorId,
        }),
      });
      if (!res.ok) throw new Error("Failed to duplicate resume");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast({
        title: "Resume Duplicated",
        description: "A copy of your resume has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to duplicate resume.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleDuplicate = (resume: ResumeItem) => {
    duplicateMutation.mutate(resume);
  };

  if (authLoading || resumesLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 flex items-center justify-center min-h-[400px]">
          <Loader size="md" text="Loading resumes..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Resumes</h1>
          <Link href="/builder">
            <Button className="gap-2">
              <PlusCircle className="w-5 h-5" />
              Create New Resume
            </Button>
          </Link>
        </div>

        {resumes && resumes.length === 0 ? (
          <Card className="text-center py-10">
            <CardHeader>
              <FileText className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <CardTitle>No Resumes Yet</CardTitle>
              <CardDescription>
                It looks like you haven't created any resumes. Start building your first one now!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/builder">
                <Button className="gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Create My First Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes?.map((resume) => (
              <Card key={resume.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{resume.title}</span>
                    <Badge variant="secondary">{resume.templateId}</Badge>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Last updated: {new Date(resume.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {/* Mini preview or details can go here */}
                  <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 h-24 overflow-hidden">
                    {resume.data?.summary || "No summary available."}
                  </div>
                </CardContent>
                <div className="flex justify-end p-4 pt-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/builder?resumeId=${resume.id}`)} className="gap-2">
                    <Edit className="w-4 h-4" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDuplicate(resume)} className="gap-2">
                    <Copy className="w-4 h-4" /> Duplicate
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your resume "{resume.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(resume.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
