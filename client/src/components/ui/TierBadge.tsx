import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles } from "lucide-react";
import type { TemplateTier } from "@shared/schema";

interface TierBadgeProps {
    tier: TemplateTier;
    size?: "sm" | "md" | "lg";
    showIcon?: boolean;
}

export function TierBadge({ tier, size = "md", showIcon = true }: TierBadgeProps) {
    const config = {
        basic: {
            label: "Free",
            className: "bg-gray-100 text-gray-700 border-gray-200",
            icon: Sparkles,
        },
        pro: {
            label: "Pro",
            className: "bg-blue-100 text-blue-700 border-blue-200",
            icon: Star,
        },
        premium: {
            label: "Premium",
            className: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-300",
            icon: Crown,
        },
    };

    const { label, className, icon: Icon } = config[tier];

    const sizeClasses = {
        sm: "text-xs px-1.5 py-0.5",
        md: "text-xs px-2 py-1",
        lg: "text-sm px-3 py-1.5",
    };

    return (
        <Badge
            variant="outline"
            className={`${className} ${sizeClasses[size]} font-semibold flex items-center gap-1`}
        >
            {showIcon && <Icon className="w-3 h-3" />}
            {label}
        </Badge>
    );
}
