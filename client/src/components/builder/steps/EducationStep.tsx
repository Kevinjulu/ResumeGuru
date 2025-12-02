import { useState } from "react";
import { useResume } from "@/lib/resumeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import type { Education } from "@shared/schema";

interface EducationStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function EducationStep({ onNext, onBack }: EducationStepProps) {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Education>>({
    degree: "",
    school: "",
    location: "",
    graduationDate: "",
    gpa: "",
    honors: "",
  });

  const resetForm = () => {
    setFormData({
      degree: "",
      school: "",
      location: "",
      graduationDate: "",
      gpa: "",
      honors: "",
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.degree || !formData.school) return;

    const education: Education = {
      id: editingId || crypto.randomUUID(),
      degree: formData.degree,
      school: formData.school,
      location: formData.location || "",
      graduationDate: formData.graduationDate || "",
      gpa: formData.gpa || "",
      honors: formData.honors || "",
      relevantCourses: [],
    };

    if (editingId) {
      updateEducation(editingId, education);
    } else {
      addEducation(education);
    }
    resetForm();
  };

  const handleEdit = (edu: Education) => {
    setFormData(edu);
    setEditingId(edu.id);
    setIsAddingNew(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Education</h2>
        <p className="text-gray-600 mt-1">
          Add your educational background, starting with your highest degree.
        </p>
      </div>

      {resumeData.education.length > 0 && !isAddingNew && (
        <div className="space-y-3">
          {resumeData.education.map((edu) => (
            <Card key={edu.id} className="p-4" data-testid={`card-education-${edu.id}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.school}{edu.location ? ` - ${edu.location}` : ""}</p>
                    {edu.graduationDate && (
                      <p className="text-xs text-gray-500 mt-1">Graduated: {edu.graduationDate}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {edu.gpa && <Badge variant="secondary" className="text-xs">GPA: {edu.gpa}</Badge>}
                      {edu.honors && <Badge variant="secondary" className="text-xs">{edu.honors}</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(edu)}
                    data-testid={`button-edit-education-${edu.id}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeEducation(edu.id)}
                    data-testid={`button-delete-education-${edu.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isAddingNew ? (
        <Card className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Degree *</label>
              <Input
                value={formData.degree}
                onChange={(e) => setFormData((prev) => ({ ...prev, degree: e.target.value }))}
                placeholder="Bachelor of Science in Computer Science"
                data-testid="input-degree"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">School/University *</label>
              <Input
                value={formData.school}
                onChange={(e) => setFormData((prev) => ({ ...prev, school: e.target.value }))}
                placeholder="State University"
                data-testid="input-school"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="New York, NY"
                data-testid="input-edu-location"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Graduation Date</label>
              <Input
                type="month"
                value={formData.graduationDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, graduationDate: e.target.value }))}
                data-testid="input-graduation-date"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">GPA (optional)</label>
              <Input
                value={formData.gpa}
                onChange={(e) => setFormData((prev) => ({ ...prev, gpa: e.target.value }))}
                placeholder="3.8"
                data-testid="input-gpa"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Honors (optional)</label>
              <Input
                value={formData.honors}
                onChange={(e) => setFormData((prev) => ({ ...prev, honors: e.target.value }))}
                placeholder="Magna Cum Laude, Dean's List"
                data-testid="input-honors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={resetForm} data-testid="button-cancel-education">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.degree || !formData.school}
              data-testid="button-save-education"
            >
              Save Education
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full py-8 border-dashed gap-2"
          onClick={() => setIsAddingNew(true)}
          data-testid="button-add-education"
        >
          <Plus className="w-5 h-5" />
          Add Education
        </Button>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2" data-testid="button-back-education">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button type="button" onClick={onNext} className="gap-2" data-testid="button-next-education">
          Save & Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
