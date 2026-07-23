import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({
  href,
  name,
  subtitle,
  className,
  showWordmark = true,
}: {
  href?: string;
  name: string;
  subtitle?: string;
  className?: string;
  showWordmark?: boolean;
}) {
  const inner = (
    <span
      className={cn(
        "inline-flex items-center gap-3",
        className,
      )}
    >
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl shadow-md ring-1 ring-stone-900/10">
        <Image
          src="/brand/logo-mark.svg"
          alt=""
          width={44}
          height={44}
          className="h-full w-full object-cover"
          priority
        />
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-tight">
          <span className="text-base font-black tracking-tight text-stone-950 md:text-lg">
            {name}
          </span>
          {subtitle && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90">
        {inner}
      </Link>
    );
  }
  return inner;
}
