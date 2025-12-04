import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SupportBilling() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription Help</h1>
        <p className="text-gray-600">Find answers about plans, payments, invoices, and cancellations.</p>

        <div className="grid gap-4">
          <Card>
            <CardContent>
              <h2 className="font-semibold">View invoices & receipts</h2>
              <p className="text-sm text-gray-600">Access your billing history from the account page under Billing.</p>
              <div className="mt-3">
                <Button asChild>
                  <a href="/account">Go to Account Billing</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-semibold">Change or cancel your plan</h2>
              <p className="text-sm text-gray-600">Upgrade, downgrade, or cancel your subscription from your account settings. Cancelling will stop future charges but does not remove access to invoices.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-semibold">Payment methods</h2>
              <p className="text-sm text-gray-600">We accept major credit cards and other payment providers. To update your payment method, visit Billing in your account.</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
