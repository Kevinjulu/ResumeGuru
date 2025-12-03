import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link, useLocation } from "wouter";
import { PlusCircle, FileText, Trash2, Edit, Copy } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useConvexAuth } from "convex/react";
import { Badge } from "@/components/ui/badge";

interface ResumeItem {
  _id: string;
  title: string;
  templateId: string;
  colorId: string;
  _creationTime: number;
  data: any; // Raw resume data
}

export default function MyResumes() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  const resumes = useQuery(api.resumes.getResumes, isAuthenticated ? undefined : "skip");

  const deleteMutation = useMutation(api.resumes.deleteResume);
  const createMutation = useMutation(api.resumes.createResume);

  const duplicateMutation = useMutation(api.resumes.createResume).withOptimisticUpdate(
    (localStore, { title, data, templateId, colorId }) => {
      const optimisticResume = {
        _id: "temp-id",
        title: `${title} (Copy)`,
        data,
        templateId,
        colorId,
        _creationTime: Date.now(),
        userId: "temp-user-id",
      };
      const existingResumes = localStore.getQuery(api.resumes.getResumes);
      if (existingResumes) {
        localStore.setQuery(
          api.resumes.getResumes,
          [...existingResumes, optimisticResume]
        );
      }
    }
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation({ id });
      toast({
        title: "Resume Deleted",
        description: "Your resume has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resume.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (resume: ResumeItem) => {
    try {
      await duplicateMutation({
        title: `${resume.title} (Copy)`,
        data: resume.data,
        templateId: resume.templateId,
        colorId: resume.colorId,
        userId: "temp-user-id", // This should be the actual user ID
      });
      toast({
        title: "Resume Duplicated",
        description: "A copy of your resume has been created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate resume.",
        variant: "destructive",
      });
    }
  };

  if (authLoading || resumes === undefined) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 text-center">Loading resumes...</div>
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
              <Card key={resume._id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{resume.title}</span>
                    <Badge variant="secondary">{resume.templateId}</Badge>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Last updated: {new Date(resume._creationTime).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {/* Mini preview or details can go here */}
                  <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 h-24 overflow-hidden">
                    {resume.data?.summary || "No summary available."}
                  </div>
                </CardContent>
                <div className="flex justify-end p-4 pt-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/builder?resumeId=${resume._id}`)} className="gap-2">
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
                        <AlertDialogAction onClick={() => handleDelete(resume._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
