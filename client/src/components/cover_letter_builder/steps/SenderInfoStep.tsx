import { useState, useEffect } from "react";
import { useCoverLetter } from "@/lib/coverLetterContext";
import { useResume } from "@/lib/resumeContext"; // To potentially pull sender info from resume
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface SenderInfoStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function SenderInfoStep({ onNext, onBack }: SenderInfoStepProps) {
  const { coverLetterData, updateSenderInfo } = useCoverLetter();
  const { resumeData } = useResume(); // Access existing resume data for sender info

  const [formData, setFormData] = useState(coverLetterData.senderInfo || {});

  // Populate from resumeData if available and not already set in coverLetterData
  useEffect(() => {
    if (resumeData.contactInfo && (!formData.firstName && !formData.lastName)) {
      setFormData((prev) => ({
        ...prev,
        firstName: resumeData.contactInfo?.firstName || '',
        lastName: resumeData.contactInfo?.lastName || '',
        email: resumeData.contactInfo?.email || '',
        phone: resumeData.contactInfo?.phone || '',
        address: resumeData.contactInfo?.address || '',
        city: resumeData.contactInfo?.city || '',
        state: resumeData.contactInfo?.state || '',
        zipCode: resumeData.contactInfo?.zipCode || '',
      }));
    }
  }, [resumeData.contactInfo]);

  useEffect(() => {
    updateSenderInfo(formData);
  }, [formData, updateSenderInfo]);

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
        <h2 className="text-2xl font-bold text-gray-900">Your Information</h2>
        <p className="text-gray-600 mt-1">
          This information will be used as the sender details on your cover letter.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-sm font-medium text-gray-700 block mb-1.5">
            First Name *
          </label>
          <Input
            id="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            placeholder="John"
            data-testid="input-sender-firstName"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="text-sm font-medium text-gray-700 block mb-1.5">
            Last Name *
          </label>
          <Input
            id="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            placeholder="Doe"
            data-testid="input-sender-lastName"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1.5">
            Email *
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            data-testid="input-sender-email"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1.5">
            Phone
          </label>
          <Input
            id="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="123-456-7890"
            data-testid="input-sender-phone"
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
            data-testid="input-sender-address"
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
            data-testid="input-sender-city"
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
            data-testid="input-sender-state"
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
            data-testid="input-sender-zip"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2" data-testid="button-back-cl-sender">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} className="gap-2" data-testid="button-next-cl-sender">
          Save & Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
