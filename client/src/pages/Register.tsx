import { SignUp } from "@clerk/clerk-react";
import { MainLayout } from "@/components/layout/MainLayout";

export default function RegisterPage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <SignUp />
      </div>
    </MainLayout>
  );
}
