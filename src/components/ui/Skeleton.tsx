interface SkeletonProps {
  variant?: "line" | "card";
  className?: string;
}

export default function Skeleton({ variant = "line", className = "" }: SkeletonProps) {
  if (variant === "card") {
    return (
      <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`}>
        <div className="aspect-[16/10] bg-gray-300 rounded-t-xl" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-3 bg-gray-300 rounded w-1/2" />
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-5/6" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-gray-300 rounded-full w-16" />
            <div className="h-6 bg-gray-300 rounded-full w-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse h-4 bg-gray-200 rounded ${className}`} />
  );
}
