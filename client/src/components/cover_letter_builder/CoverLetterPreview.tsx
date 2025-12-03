import { useCoverLetter } from "@/lib/coverLetterContext";
import { templateColors, coverLetterTemplates } from "@shared/schema";

export function CoverLetterPreview() {
  const { coverLetterData } = useCoverLetter();
  const { senderInfo, recipientInfo, date, subject, body, templateId, colorId } = coverLetterData;

  const currentColor = templateColors.find(c => c.id === colorId) || templateColors[0];
  const currentTemplate = coverLetterTemplates.find(tpl => tpl.id === templateId);

  // Fallback if no template is selected or found
  if (!currentTemplate) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex items-center justify-center text-gray-400 text-center p-8" style={{ aspectRatio: "8.5/11" }}>
        No Cover Letter Template Selected
      </div>
    );
  }

  // Basic layout for demonstration - this would be replaced by specific template components
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ aspectRatio: "8.5/11" }}>
      <div className="p-8 h-full flex flex-col justify-between text-[11px] leading-normal" style={{ fontFamily: "Arial, sans-serif" }}>
        {/* Header - Sender Info */}
        <div className="mb-6 text-right">
          <p className="font-bold text-base" style={{ color: currentColor.hex }}>{senderInfo?.firstName} {senderInfo?.lastName}</p>
          <p>{senderInfo?.address}</p>
          <p>{senderInfo?.city}, {senderInfo?.state} {senderInfo?.zipCode}</p>
          <p>{senderInfo?.phone}</p>
          <p>{senderInfo?.email}</p>
        </div>

        {/* Date */}
        <p className="mb-6 text-right">{date}</p>

        {/* Recipient Info */}
        <div className="mb-6">
          {recipientInfo?.name && <p className="font-bold">{recipientInfo.name}</p>}
          {recipientInfo?.title && <p>{recipientInfo.title}</p>}
          {recipientInfo?.company && <p>{recipientInfo.company}</p>}
          {recipientInfo?.address && <p>{recipientInfo.address}</p>}
          {recipientInfo?.city && <p>{recipientInfo.city}, {recipientInfo.state} {recipientInfo?.zipCode}</p>}
        </div>

        {/* Subject */}
        {subject && <p className="mb-6 font-bold">Subject: {subject}</p>}

        {/* Body */}
        <div className="flex-grow">
          {body ? (
            body.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3">{paragraph}</p>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-center">
              <div>
                <p className="text-sm">Your cover letter preview will appear here</p>
                <p className="text-xs mt-1">Start writing your cover letter on the left</p>
              </div>
            </div>
          )}
        </div>

        {/* Closing */}
        <div className="mt-6">
          <p>Sincerely,</p>
          <p className="font-bold mt-1">{senderInfo?.firstName} {senderInfo?.lastName}</p>
        </div>
      </div>
    </div>
  );
}
