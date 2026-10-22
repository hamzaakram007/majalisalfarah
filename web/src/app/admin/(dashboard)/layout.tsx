import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth/admin";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdminUser();
  if (!admin) {
    redirect("/admin/login");
  }

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/social", label: "Social" },
    { href: "/admin/quotes", label: "Quotes" },
    { href: "/admin/callbacks", label: "Callbacks" },
    { href: "/admin/blog", label: "Blog" },
    { href: "/admin/payments", label: "Payments" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <aside className="w-56 shrink-0 bg-zinc-900 p-4 text-white">
        <p className="mb-6 text-lg font-bold">Majalis Admin</p>
        <nav className="flex flex-col gap-2 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-emerald-300">
              {l.label}
            </Link>
          ))}
          <Link href="/en" className="mt-4 text-zinc-400 hover:text-white">
            View Site
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
