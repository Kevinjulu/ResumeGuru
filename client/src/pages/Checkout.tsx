import { MainLayout } from "@/components/layout/MainLayout";
import { useSearch } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { checkoutEvents } from "@/lib/analytics";

export default function Checkout() {
  const searchParams = useSearch();
  const params = new URLSearchParams(searchParams);
  const plan = params.get("plan");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Track checkout page view
    if (plan) {
      checkoutEvents.pageViewed(plan);
    }
  }, [plan]);

  useEffect(() => {
    // If a plan is present in query, create PayPal order and redirect to approval
    async function createOrder() {
      if (!plan) return;
      try {
        setLoading(true);
        checkoutEvents.orderCreationStarted(plan);
        const resp = await fetch('/api/billing/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier: plan }),
        });
        const data = await resp.json();
        if (!resp.ok) {
          checkoutEvents.orderCreationFailed(plan, data.error || 'Unknown error');
          setError(data.error || 'Failed to create order');
          setLoading(false);
          return;
        }
        if (data.approveUrl) {
          // Track PayPal redirect
          checkoutEvents.paypalRedirectInitiated(data.id, plan);
          // Redirect user to PayPal approval
          window.location.href = data.approveUrl;
        } else if (data.id) {
          // Fallback: show order id and instruct user
          checkoutEvents.orderCreationFailed(plan, 'Missing approval URL');
          setError('Created order ' + data.id + ' but approval URL missing.');
        }
      } catch (err: any) {
        checkoutEvents.orderCreationFailed(plan, err.message || 'Unknown error');
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    createOrder();
  }, [plan]);

  return (
    <MainLayout>
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold">Checkout</h1>
        {plan ? (
          <>
            <p className="mt-4 text-lg">You have selected the <strong>{plan}</strong> plan.</p>
            <p className="mt-2 text-gray-600">We'll redirect you to PayPal to complete the purchase.</p>
            {loading && <p className="mt-4">Redirecting to PayPal...</p>}
            {error && (
              <div className="mt-4">
                <p className="text-red-600">{error}</p>
                <Button className="mt-3" onClick={() => window.location.reload()}>Try again</Button>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="mt-4 text-lg">No plan selected. Choose a plan on the pricing page.</p>
            <p className="mt-2 text-gray-600">If you were redirected here from PayPal, check the query string for status and orderId.</p>
          </>
        )}
      </div>
    </MainLayout>
  );
}
