import { useUser } from "@/hooks/use-user";
import { canAccessTemplate, getAvailableTemplates, getRequiredTier } from "@shared/schema";
import type { TemplateId } from "@shared/schema";

export function useTemplateAccess() {
    const { user } = useUser();
    const accountTier = (user?.publicMetadata?.accountTier as string) || "free";

    return {
        canAccessTemplate: (templateId: TemplateId) =>
            canAccessTemplate(templateId, accountTier),

        getAvailableTemplates: () =>
            getAvailableTemplates(accountTier),

        getRequiredTier: (templateId: TemplateId) =>
            getRequiredTier(templateId),

        accountTier,
    };
}
