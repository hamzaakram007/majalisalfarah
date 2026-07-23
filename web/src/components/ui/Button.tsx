import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-stone-950 text-white hover:bg-stone-800",
        variant === "secondary" &&
          "border border-stone-950 bg-transparent text-stone-950 hover:bg-stone-950 hover:text-white",
        variant === "ghost" && "text-stone-800 hover:bg-stone-100",
        className,
      )}
      {...props}
    />
  );
}
