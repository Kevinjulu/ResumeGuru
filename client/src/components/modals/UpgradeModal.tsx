import { useState } from "react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import type { TemplateTier } from "@shared/schema";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    requiredTier: TemplateTier;
    templateName: string;
    thumbnail?: string;
}

export function UpgradeModal({
    isOpen,
    onClose,
    requiredTier,
    templateName,
    thumbnail
}: UpgradeModalProps) {
    const tierConfig = {
        pro: {
            name: "Pro",
            price: "$2",
            period: "month",
            icon: Star,
            color: "blue",
            features: [
                "Unlimited Resumes",
                "All 8 Templates (Basic + Pro)",
                "PDF & Word Export",
                "No Watermark",
                "AI Summary Generator",
                "Color Customization",
            ],
        },
        premium: {
            name: "Premium",
            price: "$7",
            period: "month",
            icon: Crown,
            color: "amber",
            features: [
                "Everything in Pro",
                "All 10 Premium Templates",
                "Cover Letter Builder",
                "Priority Support (24/7)",
                "LinkedIn Optimizer",
                "ATS Compatibility Report",
                "Expert Resume Review",
            ],
        },
    };

    const config = tierConfig[requiredTier as keyof typeof tierConfig] || tierConfig.pro;
    const Icon = config.icon;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Lock className="w-6 h-6 text-gray-400" />
                        Upgrade to Access "{templateName}"
                    </DialogTitle>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Template Preview */}
                    <div className="space-y-3">
                        <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                            {thumbnail ? (
                                <img
                                    src={thumbnail}
                                    alt={templateName}
                                    className="w-full h-auto"
                                />
                            ) : (
                                <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <Lock className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Badge className={`bg-${config.color}-600 text-white px-4 py-2 text-sm`}>
                                    <Icon className="w-4 h-4 mr-1" />
                                    {config.name} Only
                                </Badge>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                            This template is available with {config.name} plan
                        </p>
                    </div>

                    {/* Upgrade Details */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-bold">{config.price}</span>
                                <span className="text-gray-600">/ {config.period}</span>
                            </div>

                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <Icon className={`w-5 h-5 text-${config.color}-600`} />
                                {config.name} Plan Features
                            </h3>

                            <ul className="space-y-2">
                                {config.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-3 mt-6">
                            <Link href="/pricing">
                                <Button className="w-full gap-2" size="lg">
                                    Upgrade to {config.name}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={onClose}
                            >
                                Maybe Later
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                        💡 <strong>Pro Tip:</strong> Upgrade now and get access to all premium templates,
                        AI-powered features, and priority support to stand out from the competition!
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
