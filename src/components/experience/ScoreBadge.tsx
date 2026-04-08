interface ScoreBadgeProps {
  score: number;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "bg-emerald-500 text-white";
  if (score >= 80) return "bg-brand-blue text-white";
  if (score >= 70) return "bg-brand-yellow text-brand-charcoal";
  return "bg-gray-400 text-white";
}

export default function ScoreBadge({ score, className = "" }: ScoreBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums ${getScoreColor(score)} ${className}`}
    >
      {score}
    </span>
  );
}
