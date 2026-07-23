import { loyaltySettings } from "@/lib/data/mock";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold">Loyalty Program</h2>
        <ul className="mt-4 space-y-2 text-sm text-zinc-600">
          <li>Points per 100 SAR: {loyaltySettings.pointsPer100Sar}</li>
          <li>Redeem threshold: {loyaltySettings.redeemAt} points</li>
          <li>Discount: {loyaltySettings.discountPercent}%</li>
        </ul>
      </section>
      <section className="mt-6 rounded-lg border bg-white p-6">
        <h2 className="font-semibold">Payments</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Moyasar keys: MOYASAR_SECRET_KEY, NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY
        </p>
      </section>
      <section className="mt-6 rounded-lg border bg-white p-6">
        <h2 className="font-semibold">Notifications</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Resend (email), Twilio (WhatsApp). Without keys, notifications log to
          server console in development.
        </p>
      </section>
    </div>
  );
}
