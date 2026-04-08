interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "featured";
  className?: string;
}

export default function Card({
  children,
  variant = "default",
  className = "",
}: CardProps) {
  const base = "rounded-xl bg-white overflow-hidden";
  const variants = {
    default: "shadow-sm hover:shadow-md transition-shadow duration-200",
    featured: "ring-2 ring-brand-yellow shadow-lg",
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
