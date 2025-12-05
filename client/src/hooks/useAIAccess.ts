import { useUser } from "@/hooks/use-user";
import { hasFeatureAccess } from "@shared/schema";

export function useAIAccess() {
  const { user, isLoading } = useUser();

  // Get the user's account tier
  const accountTier = (user?.publicMetadata?.accountTier as string) || "free";

  // Check if user has AI feature access based on their tier
  const canUseAI = hasFeatureAccess(accountTier, "aiFeatures");

  return {
    isLoaded: !isLoading,
    isSignedIn: !!user,
    accountTier,
    canUseAI,
    requireUpgrade: !canUseAI,
    upgradeMessage: `AI features are available on Pro plan ($2/month) and Premium plan ($7/month)`,
  };
}
