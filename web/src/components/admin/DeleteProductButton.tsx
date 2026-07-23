"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteProductAction } from "@/app/admin/(dashboard)/products/actions";

export function DeleteProductButton({
  id,
  slug,
}: {
  id: string;
  slug: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      className="text-red-600 hover:underline disabled:opacity-50"
      onClick={async () => {
        if (!confirm(`Delete product "${slug}"?`)) return;
        setLoading(true);
        const res = await deleteProductAction(id);
        setLoading(false);
        if (res.ok) {
          router.refresh();
        } else {
          alert(res.error);
        }
      }}
    >
      Delete
    </button>
  );
}
