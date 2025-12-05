import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link, useLocation } from "wouter";
import { PlusCircle, MailOpen, Trash2, Edit, Copy } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useUser } from "@/hooks/use-user";
import { Badge } from "@/components/ui/badge";

interface CoverLetterItem {
  id: string;
  title: string;
  templateId: string;
  colorId: string;
  createdAt: string;
  data: any; // Raw cover letter data
}

export default function MyCoverLetters() {
  const { user, isLoading: authLoading } = useUser();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data: coverLetters, isLoading: coverLettersLoading } = useQuery<CoverLetterItem[]>({
    queryKey: ["coverLetters"],
    queryFn: async () => {
      const res = await fetch("/api/coverletters");
      if (!res.ok) throw new Error("Failed to fetch cover letters");
      return res.json();
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/coverletters/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete cover letter");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverLetters"] });
      toast({
        title: "Cover Letter Deleted",
        description: "Your cover letter has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete cover letter.",
        variant: "destructive",
      });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (coverLetter: CoverLetterItem) => {
      const res = await fetch("/api/coverletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${coverLetter.title} (Copy)`,
          data: coverLetter.data,
          templateId: coverLetter.templateId,
          colorId: coverLetter.colorId,
        }),
      });
      if (!res.ok) throw new Error("Failed to duplicate cover letter");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverLetters"] });
      toast({
        title: "Cover Letter Duplicated",
        description: "A copy of your cover letter has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to duplicate cover letter.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleDuplicate = (coverLetter: CoverLetterItem) => {
    duplicateMutation.mutate(coverLetter);
  };

  if (authLoading || coverLettersLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 text-center">Loading cover letters...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Cover Letters</h1>
          <Link href="/cover-letter-templates">
            <Button className="gap-2">
              <PlusCircle className="w-5 h-5" />
              Create New Cover Letter
            </Button>
          </Link>
        </div>

        {coverLetters && coverLetters.length === 0 ? (
          <Card className="text-center py-10">
            <CardHeader>
              <MailOpen className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <CardTitle>No Cover Letters Yet</CardTitle>
              <CardDescription>
                It looks like you haven't created any cover letters. Start building your first one now!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/cover-letter-templates">
                <Button className="gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Create My First Cover Letter
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coverLetters?.map((coverLetter) => (
              <Card key={coverLetter.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{coverLetter.title}</span>
                    <Badge variant="secondary">{coverLetter.templateId}</Badge>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Last updated: {new Date(coverLetter.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {/* Mini preview or details can go here */}
                  <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 h-24 overflow-hidden">
                    {coverLetter.data?.subject ? `Subject: ${coverLetter.data.subject}` : "No subject available."}
                    <br />
                    {coverLetter.data?.body ? coverLetter.data.body.substring(0, 100) + '...' : "No body content available."}
                  </div>
                </CardContent>
                <div className="flex justify-end p-4 pt-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/cover-letter-builder?coverLetterId=${coverLetter.id}`)} className="gap-2">
                    <Edit className="w-4 h-4" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDuplicate(coverLetter)} className="gap-2">
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
                          This action cannot be undone. This will permanently delete your cover letter "{coverLetter.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(coverLetter.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
