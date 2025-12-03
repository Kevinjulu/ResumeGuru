import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type Payment = {
  id: string;
  userId: string;
  tier: string;
  amount: number;
  currency: string;
  provider: string;
  providerOrderId?: string | null;
  providerCaptureId?: string | null;
  createdAt?: string | Date;
};

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ currentTier: string; billingCycle: { start: string; end: string } | null; paymentHistory: Payment[]; nextRenewalDate: string | null } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/account/subscription', { credentials: 'include' });
        if (!res.ok) {
          setError('Unable to load account');
          setLoading(false);
          return;
        }
        const j = await res.json();
        setData(j);
        setLoading(false);
      } catch {
        setError('Unable to load account');
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Account</h1>
            <Link href="/pricing">
              <Button variant="outline">View Pricing</Button>
            </Link>
          </div>

          {loading && (
            <Card className="p-6"><CardContent>Loading...</CardContent></Card>
          )}
          {error && (
            <Card className="p-6"><CardContent className="text-red-600 text-sm">{error}</CardContent></Card>
          )}
          {data && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader className="pb-2">
                  <h2 className="text-xl font-semibold">Subscription</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Current Tier:</span>
                    <Badge>{data.currentTier}</Badge>
                  </div>
                  <div className="mt-3 text-sm text-gray-700">
                    {data.billingCycle ? (
                      <div>
                        <div>Period Start: {new Date(data.billingCycle.start).toLocaleDateString()}</div>
                        <div>Period End: {new Date(data.billingCycle.end).toLocaleDateString()}</div>
                      </div>
                    ) : (
                      <div>No active billing cycle</div>
                    )}
                    <div className="mt-2">Next Renewal: {data.nextRenewalDate ? new Date(data.nextRenewalDate).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <h2 className="text-xl font-semibold">Payment History</h2>
                </CardHeader>
                <CardContent>
                  {data.paymentHistory && data.paymentHistory.length > 0 ? (
                    <div className="divide-y">
                      {data.paymentHistory.map((p) => (
                        <div key={p.id} className="py-3 flex items-center justify-between">
                          <div className="text-sm text-gray-700">{new Date(p.createdAt || Date.now()).toLocaleString()}</div>
                          <div className="text-sm font-medium">{p.provider.toUpperCase()} • {p.tier}</div>
                          <div className="text-sm">{(p.amount / 100).toFixed(2)} {p.currency}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">No payments yet</div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

