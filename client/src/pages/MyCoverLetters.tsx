import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link, useLocation } from "wouter";
import { PlusCircle, MailOpen, Trash2, Edit, Copy } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface CoverLetterItem {
  id: string;
  title: string;
  templateId: string;
  colorId: string;
  createdAt: string;
  updatedAt: string;
  data: any; // Raw cover letter data
}

export default function MyCoverLetters() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  const { data: coverLetters, isLoading, error } = useQuery<CoverLetterItem[]>({
    queryKey: ['myCoverLetters'],
    queryFn: () => apiRequest('GET', '/api/coverletters'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/coverletters/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCoverLetters'] });
      toast({
        title: "Cover Letter Deleted",
        description: "Your cover letter has been successfully deleted.",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to delete cover letter.",
        variant: "destructive",
      });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (coverLetter: CoverLetterItem) => {
      const newCoverLetter = {
        title: `${coverLetter.title} (Copy)`,
        data: coverLetter.data,
        templateId: coverLetter.templateId,
        colorId: coverLetter.colorId,
      };
      return apiRequest('POST', '/api/coverletters', newCoverLetter);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCoverLetters'] });
      toast({
        title: "Cover Letter Duplicated",
        description: "A copy of your cover letter has been created.",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to duplicate cover letter.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 text-center">Loading cover letters...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 text-center text-red-500">Error loading cover letters: {error.message}</div>
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
                    Last updated: {new Date(coverLetter.updatedAt).toLocaleDateString()}
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
                  <Button variant="outline" size="sm" onClick={() => duplicateMutation.mutate(coverLetter)} className="gap-2">
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
                        <AlertDialogAction onClick={() => deleteMutation.mutate(coverLetter.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
