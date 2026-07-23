export {};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    ttq?: {
      track: (...args: unknown[]) => void;
      page: () => void;
      load: (id: string) => void;
    };
  }
}
