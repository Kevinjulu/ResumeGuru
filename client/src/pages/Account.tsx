import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
// import { useAuth, useUser } from "@clerk/clerk-react"; // Removed Clerk imports
import { useUser } from "@/hooks/use-user"; // Added custom hook
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { FullPageLoader } from "@/components/common/Loader";
import {
  User,
  Mail,
  Shield,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Check,
  AlertCircle,
  Download,
  Clock,
  FileText,
  Link as LinkIcon,
  Camera,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Account() {
  const { user, isLoaded, logout } = useUser();
  // const { signOut } = useAuth(); // Removed Clerk useAuth
  const [activeTab, setActiveTab] = useState("profile");
  const [subscription, setSubscription] = useState<any>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload avatar");

      const data = await res.json();

      // Invalidate user query to refresh avatar
      queryClient.invalidateQueries({ queryKey: ["user"] });

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Fetch subscription data when account page loads
  useEffect(() => {
    async function loadSubscription() {
      try {
        setLoadingSubscription(true);
        const resp = await fetch('/api/account/subscription');
        if (resp.ok) {
          const data = await resp.json();
          setSubscription(data);
        }
      } catch (err) {
        console.error('Failed to load subscription:', err);
      } finally {
        setLoadingSubscription(false);
      }
    }
    if (isLoaded) {
      loadSubscription();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
          <FullPageLoader text="Loading your account..." />
        </div>
      </MainLayout>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Profile Header */}
            <Card className="bg-gradient-to-br from-orange-50 to-blue-50 border border-orange-100">
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex gap-6">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
                        {user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span>{user?.username?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                      >
                        <Camera className="w-6 h-6" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {user?.username}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" />
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => toast({ title: "Not implemented", description: "Profile editing is coming soon." })}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Account Information
                </h3>
              </CardHeader>
              <Separator />
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Username
                      </p>
                      <p className="text-gray-900 font-semibold mt-1">
                        {user?.username}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Email Address
                      </p>
                      <p className="text-gray-900 font-semibold mt-1">
                        {user?.email}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Member Since
                      </p>
                      <p className="text-gray-900 font-semibold mt-1">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case "billing":
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            {loadingSubscription ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading subscription...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Current Plan */}
                <Card className="border-2 border-primary bg-gradient-to-br from-orange-50 to-transparent">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Current Plan
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2 capitalize">
                          {subscription?.currentTier || "free"} Plan
                        </h3>
                        <p className="text-gray-600 mt-2">
                          {subscription?.currentTier === "pro" && "Unlimited resumes, all templates, PDF/Word exports, AI features"}
                          {subscription?.currentTier === "premium" && "Everything + Cover letters, LinkedIn optimizer, expert review, priority support"}
                          {subscription?.currentTier === "free" && "Unlimited access to 3 templates with basic formatting"}
                        </p>
                        {subscription?.nextRenewalDate && (
                          <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Next renewal: {new Date(subscription.nextRenewalDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {subscription?.currentTier === "free" && (
                        <a href="/pricing">
                          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                            Upgrade Plan
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Billing History */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Billing History
                    </h3>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-6">
                    {subscription?.paymentHistory && subscription.paymentHistory.length > 0 ? (
                      <div className="space-y-4">
                        {subscription.paymentHistory.map((payment: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                            <div>
                              <p className="font-medium text-gray-900 capitalize">{payment.tier} Plan</p>
                              <p className="text-sm text-gray-600">
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                ${(payment.amount / 100).toFixed(2)} {payment.currency}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">{payment.provider}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          No billing history available
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Your invoices will appear here once you upgrade to a paid plan
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </motion.div>
        );

      case "security":
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Password */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Password & Security
                </h3>
              </CardHeader>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Preferences
                </h3>
              </CardHeader>
              <Separator />
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">
                        Email Notifications
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Receive updates about your resumes and account activity
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 text-primary rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">
                        Marketing Emails
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Get tips, features updates, and special offers
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      className="w-5 h-5 text-primary rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        Download Your Data
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Request a copy of all your data in JSON format
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Danger Zone
                </h3>
              </CardHeader>
              <Separator className="bg-red-200" />
              <CardContent className="p-6">
                <p className="text-sm text-red-800 mb-4">
                  These actions cannot be undone. Please proceed with caution.
                </p>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-100 w-full"
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
        {/* Header Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Account Settings
              </h1>
              <p className="text-gray-600">
                Manage your profile, billing, and security settings
              </p>
            </div>
            <Button
              onClick={() => logout()}
              className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Tabs Navigation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12"
          >
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  variants={itemVariants}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative p-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center md:justify-start gap-2 ${activeTab === tab.id
                    ? "bg-white border-2 border-primary text-primary shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                >
                  <TabIcon className="w-5 h-5" />
                  <span className="hidden md:inline">{tab.label}</span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {renderTabContent()}
          </motion.div>
        </motion.section>
      </div>
    </MainLayout>
  );
}
