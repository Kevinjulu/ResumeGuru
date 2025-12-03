import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResume } from "@/lib/resumeContext";
import { contactInfoSchema, type ContactInfo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface ContactStepProps {
  onNext: () => void;
}

export function ContactStep({ onNext }: ContactStepProps) {
  const { resumeData, updateContactInfo } = useResume();

  const form = useForm<ContactInfo>({
    resolver: zodResolver(contactInfoSchema.partial()),
    defaultValues: {
      firstName: resumeData.contactInfo?.firstName || "",
      lastName: resumeData.contactInfo?.lastName || "",
      email: resumeData.contactInfo?.email || "",
      phone: resumeData.contactInfo?.phone || "",
      city: resumeData.contactInfo?.city || "",
      state: resumeData.contactInfo?.state || "",
      zipCode: resumeData.contactInfo?.zipCode || "",
      linkedin: resumeData.contactInfo?.linkedin || "",
      website: resumeData.contactInfo?.website || "",
    },
  });

  const onSubmit = (data: ContactInfo) => {
    updateContactInfo(data);
    onNext();
  };

  const handleFieldChange = (field: keyof ContactInfo, value: string) => {
    updateContactInfo({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 gradient-text-primary">Contact Information</h2>
        <p className="text-gray-600 mt-1">
          Let employers know how to reach you. This information will appear at the top of your resume.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    First Name
                  </FormLabel>
                  <FormControl>
                    <div className="bg-white/80 border border-gray-200 rounded-md p-1">
                      <Input
                        placeholder="John"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFieldChange("firstName", e.target.value);
                        }}
                        data-testid="input-first-name"
                        className="bg-transparent"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("lastName", e.target.value);
                      }}
                      data-testid="input-last-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@email.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("email", e.target.value);
                      }}
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("phone", e.target.value);
                      }}
                      data-testid="input-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    City
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="New York"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("city", e.target.value);
                      }}
                      data-testid="input-city"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="NY"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("state", e.target.value);
                      }}
                      data-testid="input-state"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="10001"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("zipCode", e.target.value);
                      }}
                      data-testid="input-zip"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="linkedin.com/in/johndoe"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("linkedin", e.target.value);
                      }}
                      data-testid="input-linkedin"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("website", e.target.value);
                      }}
                      data-testid="input-website"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              size="lg"
              data-testid="button-next-contact"
              className="gradient-primary text-white shadow"
            >
              Save & Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
