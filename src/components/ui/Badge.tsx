interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "yellow" | "score";
  className?: string;
}

const variantStyles = {
  default: "bg-brand-light-blue text-brand-blue",
  yellow: "bg-brand-yellow/20 text-brand-charcoal",
  score: "",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
