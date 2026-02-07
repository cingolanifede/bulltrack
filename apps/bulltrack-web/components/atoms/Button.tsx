import { forwardRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:opacity-50";
    const variants = {
      primary: "bg-zinc-900 text-white hover:bg-zinc-800",
      secondary:
        "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50",
      outline:
        "border-2 border-primary bg-transparent text-primary hover:bg-primary/10",
      ghost: "text-zinc-700 hover:bg-zinc-100",
    };
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
