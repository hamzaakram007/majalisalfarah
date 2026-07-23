"use client";

import { trackEvent } from "@/lib/analytics/events";

export function TrackedWhatsAppLink({
  href,
  children,
  className,
  source,
  locale,
  ...props
}: React.ComponentProps<"a"> & {
  source: string;
  locale?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackEvent("whatsapp_click", { source, locale: locale ?? "en" })
      }
      {...props}
    >
      {children}
    </a>
  );
}
