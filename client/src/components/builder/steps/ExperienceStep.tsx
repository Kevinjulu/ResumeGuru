import { useState } from "react";
import { useResume } from "@/lib/resumeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft, ArrowRight, Briefcase, GripVertical } from "lucide-react";
import { prewrittenBullets, jobCategories, type Experience } from "@shared/schema";

interface ExperienceStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ExperienceStep({ onNext, onBack }: ExperienceStepProps) {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Customer Service");

  const [formData, setFormData] = useState<Partial<Experience>>({
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    bullets: [],
  });

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [],
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.jobTitle || !formData.company || !formData.startDate) return;

    const experience: Experience = {
      id: editingId || crypto.randomUUID(),
      jobTitle: formData.jobTitle,
      company: formData.company,
      location: formData.location || "",
      startDate: formData.startDate,
      endDate: formData.endDate || "",
      current: formData.current || false,
      bullets: formData.bullets || [],
    };

    if (editingId) {
      updateExperience(editingId, experience);
    } else {
      addExperience(experience);
    }
    resetForm();
  };

  const handleEdit = (exp: Experience) => {
    setFormData(exp);
    setEditingId(exp.id);
    setIsAddingNew(true);
  };

  const handleAddBullet = (bullet: string) => {
    if (!formData.bullets?.includes(bullet)) {
      setFormData((prev) => ({
        ...prev,
        bullets: [...(prev.bullets || []), bullet],
      }));
    }
  };

  const handleRemoveBullet = (bullet: string) => {
    setFormData((prev) => ({
      ...prev,
      bullets: prev.bullets?.filter((b) => b !== bullet) || [],
    }));
  };

  const currentBullets = prewrittenBullets[selectedCategory] || prewrittenBullets["Customer Service"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
        <p className="text-gray-600 mt-1">
          Add your work history, starting with your most recent position.
        </p>
      </div>

      {resumeData.experiences.length > 0 && !isAddingNew && (
        <div className="space-y-3">
          {resumeData.experiences.map((exp) => (
            <Card key={exp.id} className="p-4" data-testid={`card-experience-${exp.id}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-sm text-gray-600">{exp.company}{exp.location ? ` - ${exp.location}` : ""}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </p>
                    {exp.bullets.length > 0 && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {exp.bullets.length} bullet{exp.bullets.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(exp)}
                    data-testid={`button-edit-experience-${exp.id}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeExperience(exp.id)}
                    data-testid={`button-delete-experience-${exp.id}`}
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
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Job Title *</label>
              <Input
                value={formData.jobTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))}
                placeholder="Software Engineer"
                data-testid="input-job-title"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Company *</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="Acme Inc."
                data-testid="input-company"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="New York, NY"
              data-testid="input-exp-location"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Start Date *</label>
              <Input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                data-testid="input-start-date"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">End Date</label>
              <Input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                disabled={formData.current}
                data-testid="input-end-date"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="current"
              checked={formData.current}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, current: checked as boolean, endDate: "" }))
              }
              data-testid="checkbox-current"
            />
            <label htmlFor="current" className="text-sm text-gray-700 cursor-pointer">
              I currently work here
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Bullet Points</label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2" data-testid="button-add-bullets">
                    <Plus className="w-4 h-4" />
                    Add Pre-written Bullets
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Choose Bullet Points</DialogTitle>
                  </DialogHeader>
                  <div className="mb-4">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger data-testid="select-bullet-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {currentBullets.map((bullet, i) => {
                      const isSelected = formData.bullets?.includes(bullet);
                      return (
                        <Card
                          key={i}
                          className={`p-3 cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-primary/5 border-primary/20"
                              : "hover:bg-gray-50 hover:border-gray-300"
                          }`}
                          onClick={() => isSelected ? handleRemoveBullet(bullet) : handleAddBullet(bullet)}
                          data-testid={`card-bullet-${i}`}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox checked={isSelected} className="mt-0.5" />
                            <p className="text-sm text-gray-700">{bullet}</p>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {formData.bullets && formData.bullets.length > 0 ? (
              <div className="space-y-2">
                {formData.bullets.map((bullet, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg group"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="flex-1 text-sm text-gray-700">{bullet}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 text-red-500"
                      onClick={() => handleRemoveBullet(bullet)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                No bullet points added yet. Click "Add Pre-written Bullets" to get started.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={resetForm} data-testid="button-cancel-experience">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.jobTitle || !formData.company || !formData.startDate}
              data-testid="button-save-experience"
            >
              Save Experience
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full py-8 border-dashed gap-2"
          onClick={() => setIsAddingNew(true)}
          data-testid="button-add-experience"
        >
          <Plus className="w-5 h-5" />
          Add Work Experience
        </Button>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2" data-testid="button-back-experience">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button type="button" onClick={onNext} className="gap-2" data-testid="button-next-experience">
          Save & Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
