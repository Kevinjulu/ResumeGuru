import { SignIn } from "@clerk/clerk-react";
import { MainLayout } from "@/components/layout/MainLayout";

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <SignIn />
      </div>
    </MainLayout>
  );
}
