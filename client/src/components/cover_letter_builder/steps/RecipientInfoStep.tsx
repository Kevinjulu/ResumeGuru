import { useState, useEffect } from "react";
import { useCoverLetter } from "@/lib/coverLetterContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface RecipientInfoStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function RecipientInfoStep({ onNext, onBack }: RecipientInfoStepProps) {
  const { coverLetterData, updateRecipientInfo } = useCoverLetter();
  const [formData, setFormData] = useState(coverLetterData.recipientInfo || {});

  useEffect(() => {
    updateRecipientInfo(formData);
  }, [formData, updateRecipientInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recipient Information</h2>
        <p className="text-gray-600 mt-1">
          Enter the details of the person or company you are sending the cover letter to.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1.5">
            Recipient Name
          </label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Hiring Manager"
            data-testid="input-recipient-name"
          />
        </div>
        <div>
          <label htmlFor="title" className="text-sm font-medium text-gray-700 block mb-1.5">
            Recipient Title
          </label>
          <Input
            id="title"
            value={formData.title || ""}
            onChange={handleChange}
            placeholder="e.g., Head of Engineering"
            data-testid="input-recipient-title"
          />
        </div>
        <div>
          <label htmlFor="company" className="text-sm font-medium text-gray-700 block mb-1.5">
            Company
          </label>
          <Input
            id="company"
            value={formData.company || ""}
            onChange={handleChange}
            placeholder="Acme Inc."
            data-testid="input-recipient-company"
          />
        </div>
        <div>
          <label htmlFor="address" className="text-sm font-medium text-gray-700 block mb-1.5">
            Address
          </label>
          <Input
            id="address"
            value={formData.address || ""}
            onChange={handleChange}
            placeholder="123 Main St"
            data-testid="input-recipient-address"
          />
        </div>
        <div>
          <label htmlFor="city" className="text-sm font-medium text-gray-700 block mb-1.5">
            City
          </label>
          <Input
            id="city"
            value={formData.city || ""}
            onChange={handleChange}
            placeholder="San Francisco"
            data-testid="input-recipient-city"
          />
        </div>
        <div>
          <label htmlFor="state" className="text-sm font-medium text-gray-700 block mb-1.5">
            State
          </label>
          <Input
            id="state"
            value={formData.state || ""}
            onChange={handleChange}
            placeholder="CA"
            data-testid="input-recipient-state"
          />
        </div>
        <div>
          <label htmlFor="zipCode" className="text-sm font-medium text-gray-700 block mb-1.5">
            Zip Code
          </label>
          <Input
            id="zipCode"
            value={formData.zipCode || ""}
            onChange={handleChange}
            placeholder="94105"
            data-testid="input-recipient-zip"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2" data-testid="button-back-cl-recipient">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} className="gap-2" data-testid="button-next-cl-recipient">
          Save & Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
