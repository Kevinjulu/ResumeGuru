import { MainLayout } from "@/components/layout/MainLayout";
import { useSearch } from "wouter";

export default function Checkout() {
  const searchParams = useSearch();
  const params = new URLSearchParams(searchParams);
  const plan = params.get("plan");

  return (
    <MainLayout>
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-4 text-lg">
          You have selected the <strong>{plan}</strong> plan.
        </p>
        <p className="mt-2 text-gray-600">
          This is a placeholder page. In a real application, this would be a form to collect payment information.
        </p>
      </div>
    </MainLayout>
  );
}
