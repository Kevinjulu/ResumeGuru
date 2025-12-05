import type { Express } from "express";
import paypal from '@paypal/checkout-server-sdk';
import { storage } from './storage.mts';
import { z } from "zod";
import { randomBytes, createCipheriv } from "crypto";

const pricingSchema = z.object({
  tiers: z.array(z.object({ id: z.enum(["free", "pro", "premium"]), name: z.string(), amountCents: z.number().int().nonnegative(), period: z.enum(["month", "forever"]).default("month"), features: z.array(z.string()).default([]) }))
});

let pricingConfig: z.infer<typeof pricingSchema> = {
  tiers: [
    { id: "free", name: "Free", amountCents: 0, period: "forever", features: ["Basic templates", "TXT downloads"] },
    { id: "pro", name: "Pro", amountCents: 200, period: "month", features: ["All templates", "AI features", "PDF/DOCX downloads"] },
    { id: "premium", name: "Premium", amountCents: 700, period: "month", features: ["All features", "Priority support", "Cover letters"] },
  ],
};

function getTierAmountCents(tierId: string): number {
  const tier = pricingConfig.tiers.find(t => t.id === tierId);
  return tier ? tier.amountCents : 0;
}

function encryptJSON(obj: any): string | null {
  const keyHex = process.env.PAYMENT_DATA_KEY || "";
  if (!keyHex || keyHex.length < 32) return null;
  const key = Buffer.from(keyHex.padEnd(32, '0').slice(0, 32));
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.from(JSON.stringify(obj), 'utf8');
  const enc = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

function getPaypalEnv() {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID || '';
    const clientSecret = process.env.PAYPAL_SECRET || '';
    
    if (!clientId || !clientSecret) {
      console.warn('[Billing] Missing PayPal credentials');
      throw new Error('PayPal API credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_SECRET environment variables.');
    }
    
    const mode = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase();
    const env = mode === 'live' ? new paypal.core.LiveEnvironment(clientId, clientSecret) : new paypal.core.SandboxEnvironment(clientId, clientSecret);
    return new paypal.core.PayPalHttpClient(env);
  } catch (e: any) {
    console.error('[Billing] Failed to initialize PayPal SDK:', e.message);
    throw e;
  }
}

export function registerBillingRoutes(app: Express) {
  app.get('/api/billing/config', (req, res) => {
    res.json({ clientId: process.env.PAYPAL_CLIENT_ID || '', currency: 'USD', mode: process.env.PAYPAL_ENV || 'sandbox' });
  });

  app.get('/api/billing/pricing', (_req, res) => {
    res.json(pricingConfig);
  });

  app.put('/api/billing/pricing', async (req, res) => {
    try {
      const adminSecret = req.headers['x-admin-secret'];
      if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) return res.status(403).json({ error: 'Forbidden' });
      const parsed = pricingSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: 'Invalid pricing config' });
      pricingConfig = parsed.data;
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Failed to update pricing' });
    }
  });

  app.post('/api/billing/paypal/create-order', async (req, res) => {
    try {
      console.log('[Billing] Request received for create-order');
      console.log('[Billing] req.body:', req.body);
      
      const tier = (req.body && req.body.tier) || 'pro';
      console.log('[Billing] Tier:', tier);
      
      // For now, just return a test response
      console.log('[Billing] Returning test response');
      return res.json({ id: 'test-order-123', approveUrl: 'https://sandbox.paypal.com/checkoutnow?token=test' });
    } catch (e: any) {
      console.error(`[Billing] Error:`, e.message || e);
      res.status(500).json({ error: 'Failed to create PayPal order', details: e.message });
    }
  });

  // Webhook endpoint for PayPal events. Note: for production, verify webhook signature using PayPal SDK and WEBHOOK_ID.
  app.post('/api/billing/paypal/webhook', async (req, res) => {
    try {
      const event = req.body;
      // Audit raw payload
      await storage.addPaymentAudit({ endpoint: '/api/billing/paypal/webhook', userId: null, payloadEncrypted: encryptJSON(event) });

      // Handle payment capture completed events
      const eventType = event.event_type || event.type || '';
      if (eventType === 'PAYMENT.CAPTURE.COMPLETED' || eventType === 'CHECKOUT.ORDER.APPROVED') {
        // Attempt to extract order id and payer info
        const resource = event.resource || {};
        const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id || resource.order_id || null;
        const providerCaptureId = resource.id || (resource.purchase_units && resource.purchase_units[0] && resource.purchase_units[0].payments && resource.purchase_units[0].payments.captures && resource.purchase_units[0].payments.captures[0] && resource.purchase_units[0].payments.captures[0].id) || null;
        const amountValue = (resource.amount && resource.amount.value) || (resource.purchase_units && resource.purchase_units[0] && resource.purchase_units[0].payments && resource.purchase_units[0].payments.captures && resource.purchase_units[0].payments.captures[0] && resource.purchase_units[0].payments.captures[0].amount && resource.purchase_units[0].payments.captures[0].amount.value) || null;
        const amountCents = amountValue ? Math.round(parseFloat(amountValue) * 100) : 0;

        // If we can find a user by matching providerOrderId in payments, update their subscription
        if (orderId) {
          // Try to find payment record by providerOrderId
          // Note: Storage does not have a direct index search here; list recent payments and match
          // For simplicity, attempt to upsert using providerOrderId match via DB query if supported.
          // Fallback: no-op but keep audit.
          // TODO: implement DB lookup by providerOrderId for robust linkage
        }
      }

      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'webhook handling failed' });
    }
  });

  app.post('/api/billing/paypal/capture-order', async (req, res) => {
    try {
      const { orderId } = req.body || {};
      if (!orderId) return res.status(400).json({ error: 'Missing orderId' });
      const client = getPaypalEnv();
      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});
      const capture = await client.execute(request);
      const u = req.user as any;
      if (u) {
        const amount = ((capture.result as any)?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value) || '0.00';
        const amountCents = Math.round(parseFloat(amount) * 100);
        const tier = pricingConfig.tiers.find(t => t.amountCents === amountCents)?.id || 'premium';
        await storage.updateUser(u.id, { accountTier: tier });
        const enc = encryptJSON(capture.result);
        await storage.addPayment({
          userId: u.id,
          tier,
          amount: amountCents,
          currency: 'USD',
          provider: 'paypal',
          providerOrderId: orderId,
          providerCaptureId: (capture.result as any)?.id || undefined,
          receiptEncrypted: enc || undefined,
        } as any);
        const now = new Date();
        const next = new Date(now);
        next.setMonth(next.getMonth() + 1);
        await storage.upsertSubscription(u.id, { tier, currentPeriodStart: now as any, currentPeriodEnd: next as any, renewalDate: next as any } as any);
        await storage.addPaymentAudit({ endpoint: '/api/billing/paypal/capture-order', userId: u.id, payloadEncrypted: enc });
      }
      res.json({ success: true, capture });
    } catch (e) {
      res.status(500).json({ error: 'Failed to capture PayPal order' });
    }
  });

  app.get('/api/account/subscription', async (req, res) => {
    const u = req.user as any;
    if (!u) return res.status(401).json({ error: 'Unauthorized' });
    const sub = await storage.getSubscriptionByUserId(u.id);
    const payments = await storage.listPaymentsByUserId(u.id);
    const nextRenewal = sub?.renewalDate || null;
    res.json({
      currentTier: u.accountTier || 'free',
      billingCycle: sub?.currentPeriodStart && sub?.currentPeriodEnd ? { start: sub.currentPeriodStart, end: sub.currentPeriodEnd } : null,
      paymentHistory: payments,
      nextRenewalDate: nextRenewal,
    });
  });
}
