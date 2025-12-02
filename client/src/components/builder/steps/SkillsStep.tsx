import { useState } from "react";
import { useResume } from "@/lib/resumeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, ArrowLeft, ArrowRight, Sparkles, Award } from "lucide-react";
import { prewrittenSkills, jobCategories, type Skill } from "@shared/schema";

interface SkillsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function SkillsStep({ onNext, onBack }: SkillsStepProps) {
  const { resumeData, addSkill, removeSkill } = useResume();
  const [newSkill, setNewSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Developer");

  const handleAddSkill = () => {
    if (newSkill.trim() && !resumeData.skills.some((s) => s.name.toLowerCase() === newSkill.toLowerCase())) {
      const skill: Skill = {
        id: crypto.randomUUID(),
        name: newSkill.trim(),
      };
      addSkill(skill);
      setNewSkill("");
    }
  };

  const handleAddPrewrittenSkill = (skillName: string) => {
    if (!resumeData.skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
      const skill: Skill = {
        id: crypto.randomUUID(),
        name: skillName,
      };
      addSkill(skill);
    }
  };

  const currentSkills = prewrittenSkills[selectedCategory] || prewrittenSkills["Developer"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
        <p className="text-gray-600 mt-1">
          Add skills relevant to the job you're applying for. Include both technical and soft skills.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddSkill();
            }
          }}
          placeholder="Type a skill and press Enter..."
          data-testid="input-new-skill"
        />
        <Button onClick={handleAddSkill} className="gap-2" data-testid="button-add-skill">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {resumeData.skills.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Your Skills ({resumeData.skills.length})</h3>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill) => (
              <Badge
                key={skill.id}
                variant="secondary"
                className="px-3 py-1.5 gap-2 text-sm"
                data-testid={`badge-skill-${skill.id}`}
              >
                {skill.name}
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="hover:bg-gray-300 rounded-full p-0.5"
                  data-testid={`button-remove-skill-${skill.id}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-gray-900">Suggested Skills</h3>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]" data-testid="select-skill-category">
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

        <div className="flex flex-wrap gap-2">
          {currentSkills.map((skill) => {
            const isAdded = resumeData.skills.some((s) => s.name.toLowerCase() === skill.toLowerCase());
            return (
              <Badge
                key={skill}
                variant={isAdded ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  isAdded ? "opacity-50" : "hover:bg-primary hover:text-white"
                }`}
                onClick={() => !isAdded && handleAddPrewrittenSkill(skill)}
                data-testid={`badge-suggested-${skill.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {isAdded ? (
                  skill
                ) : (
                  <>
                    <Plus className="w-3 h-3 mr-1" />
                    {skill}
                  </>
                )}
              </Badge>
            );
          })}
        </div>
      </Card>

      <Card className="p-4 bg-blue-50 border-blue-100">
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Tips for listing skills</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>Include a mix of hard (technical) and soft skills</li>
              <li>Match skills to the job description keywords</li>
              <li>Be specific - "Python" is better than "Programming"</li>
              <li>Aim for 8-12 relevant skills</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2" data-testid="button-back-skills">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button type="button" onClick={onNext} className="gap-2" data-testid="button-next-skills">
          Save & Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
