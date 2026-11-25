let analyticsAllowed = false;

try {
  analyticsAllowed = localStorage.getItem('bt_cookie_consent_v1') === 'all';
} catch {
  analyticsAllowed = false;
}

export function setAnalyticsConsent(allowed: boolean) {
  analyticsAllowed = allowed;
}

export function trackPageView(path: string) {
  if (!analyticsAllowed) return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', 'page_view', { page_path: path });
  }
}

export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (!analyticsAllowed) return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', name, params);
  }
}
