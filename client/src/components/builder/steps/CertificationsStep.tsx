import { useState } from "react";
import { useResume } from "@/lib/resumeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, ArrowRight, Award } from "lucide-react";
import type { Certification } from "@shared/schema";

interface CertificationsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function CertificationsStep({ onNext, onBack }: CertificationsStepProps) {
  const { resumeData, addCertification, updateCertification, removeCertification } = useResume();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Certification>>({
    name: "",
    issuer: "",
    date: "",
    expirationDate: "",
    credentialId: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      issuer: "",
      date: "",
      expirationDate: "",
      credentialId: "",
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.name) return;

    const certification: Certification = {
      id: editingId || crypto.randomUUID(),
      name: formData.name,
      issuer: formData.issuer || "",
      date: formData.date || "",
      expirationDate: formData.expirationDate || "",
      credentialId: formData.credentialId || "",
    };

    if (editingId) {
      updateCertification(editingId, certification);
    } else {
      addCertification(certification);
    }
    resetForm();
  };

  const handleEdit = (cert: Certification) => {
    setFormData(cert);
    setEditingId(cert.id);
    setIsAddingNew(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
        <p className="text-gray-600 mt-1">
          Add professional certifications, licenses, or credentials that are relevant to your career.
        </p>
      </div>

      {resumeData.certifications.length > 0 && !isAddingNew && (
        <div className="space-y-3">
          {resumeData.certifications.map((cert) => (
            <Card key={cert.id} className="p-4" data-testid={`card-certification-${cert.id}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    {cert.issuer && <p className="text-sm text-gray-600">{cert.issuer}</p>}
                    {cert.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Issued: {cert.date}
                        {cert.expirationDate && ` - Expires: ${cert.expirationDate}`}
                      </p>
                    )}
                    {cert.credentialId && (
                      <p className="text-xs text-gray-400 mt-1">ID: {cert.credentialId}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(cert)}
                    data-testid={`button-edit-cert-${cert.id}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeCertification(cert.id)}
                    data-testid={`button-delete-cert-${cert.id}`}
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
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Certification Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="AWS Certified Solutions Architect"
              data-testid="input-cert-name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Issuing Organization</label>
            <Input
              value={formData.issuer}
              onChange={(e) => setFormData((prev) => ({ ...prev, issuer: e.target.value }))}
              placeholder="Amazon Web Services"
              data-testid="input-cert-issuer"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Issue Date</label>
              <Input
                type="month"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                data-testid="input-cert-date"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Expiration Date (if applicable)</label>
              <Input
                type="month"
                value={formData.expirationDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, expirationDate: e.target.value }))}
                data-testid="input-cert-expiration"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Credential ID (optional)</label>
            <Input
              value={formData.credentialId}
              onChange={(e) => setFormData((prev) => ({ ...prev, credentialId: e.target.value }))}
              placeholder="ABC123XYZ"
              data-testid="input-cert-id"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={resetForm} data-testid="button-cancel-cert">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name} data-testid="button-save-cert">
              Save Certification
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full py-8 border-dashed gap-2"
          onClick={() => setIsAddingNew(true)}
          data-testid="button-add-certification"
        >
          <Plus className="w-5 h-5" />
          Add Certification
        </Button>
      )}

      <Card className="p-4 bg-gray-50 border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          Certifications are optional. If you don't have any, you can skip this step.
        </p>
      </Card>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2" data-testid="button-back-certs">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button type="button" onClick={onNext} className="gap-2" data-testid="button-next-certs">
          Save & Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
