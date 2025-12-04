/**
 * Simple analytics utility for tracking events.
 * Integrates with common providers (GA, Segment, etc.) if configured.
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

export function trackEvent(event: AnalyticsEvent) {
  try {
    // Send to custom backend endpoint if available
    if (typeof window !== 'undefined' && window.fetch) {
      // Log locally for now
      console.log('[Analytics]', event.name, event.properties);

      // If you integrate GA, Mixpanel, Segment, etc., add here:
      // gtag('event', event.name, event.properties);
      // analytics.track(event.name, event.properties);
    }
  } catch (err) {
    console.error('Analytics error:', err);
  }
}

// Pricing page events
export const pricingEvents = {
  pageViewed: () => trackEvent({ name: 'pricing_page_viewed' }),
  planCardClicked: (plan: string) => trackEvent({ name: 'plan_card_clicked', properties: { plan } }),
  comparisontTableViewed: () => trackEvent({ name: 'comparison_table_viewed' }),
  faqAccordionOpened: (question: string) => trackEvent({ name: 'faq_opened', properties: { question } }),
  ctaButtonClicked: (plan: string) => trackEvent({ name: 'cta_button_clicked', properties: { plan } }),
};

// Checkout events
export const checkoutEvents = {
  pageViewed: (plan: string) => trackEvent({ name: 'checkout_page_viewed', properties: { plan } }),
  orderCreationStarted: (plan: string) => trackEvent({ name: 'order_creation_started', properties: { plan } }),
  orderCreationFailed: (plan: string, error: string) => trackEvent({ name: 'order_creation_failed', properties: { plan, error } }),
  paypalRedirectInitiated: (orderId: string, plan: string) => trackEvent({ name: 'paypal_redirect_initiated', properties: { orderId, plan } }),
  checkoutCompleted: (orderId: string, plan: string, amount: number) => trackEvent({ name: 'checkout_completed', properties: { orderId, plan, amount } }),
  checkoutCancelled: (plan: string) => trackEvent({ name: 'checkout_cancelled', properties: { plan } }),
};

// Builder feature gating events
export const builderEvents = {
  pdfExportAttempted: (planTier: string) => trackEvent({ name: 'pdf_export_attempted', properties: { planTier } }),
  pdfExportBlocked: (planTier: string) => trackEvent({ name: 'pdf_export_blocked', properties: { planTier } }),
  wordExportAttempted: (planTier: string) => trackEvent({ name: 'word_export_attempted', properties: { planTier } }),
  wordExportBlocked: (planTier: string) => trackEvent({ name: 'word_export_blocked', properties: { planTier } }),
  coverLetterStarted: (planTier: string) => trackEvent({ name: 'cover_letter_started', properties: { planTier } }),
  coverLetterBlocked: (planTier: string) => trackEvent({ name: 'cover_letter_blocked', properties: { planTier } }),
  gatedFeatureClicked: (feature: string, planTier: string) => trackEvent({ name: 'gated_feature_clicked', properties: { feature, planTier } }),
};
