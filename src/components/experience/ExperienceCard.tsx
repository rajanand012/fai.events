import Link from "next/link";
import Badge from "@/components/ui/Badge";
import ScoreBadge from "@/components/experience/ScoreBadge";

export interface Experience {
  id: string;
  slug: string;
  title: string;
  destination: string;
  province: string;
  category: string;
  summaryShort: string;
  imageUrl?: string;
  aiScore: number;
  tags: string[];
  isFeatured?: boolean;
}

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const {
    slug,
    title,
    destination,
    province,
    category,
    summaryShort,
    imageUrl,
    aiScore,
    tags,
    isFeatured,
  } = experience;

  return (
    <Link
      href={`/experience/${slug}`}
      className="group block rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-blue to-brand-light-blue" />
        )}

        {/* Category badge, top-left */}
        <div className="absolute top-3 left-3">
          <Badge variant="default" className="text-xs backdrop-blur-sm bg-white/90 text-brand-blue">
            {category}
          </Badge>
        </div>

        {/* Score badge, top-right */}
        <div className="absolute top-3 right-3">
          <ScoreBadge score={aiScore} />
        </div>

        {/* Featured indicator */}
        {isFeatured && (
          <div className="absolute bottom-0 left-0 right-0 bg-brand-yellow/90 text-brand-charcoal text-xs font-semibold text-center py-1">
            Featured Experience
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-brand-charcoal leading-snug line-clamp-1">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1 text-sm text-brand-charcoal/60">
          <svg
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            {destination}, {province}
          </span>
        </div>

        {/* Summary */}
        <p className="mt-2 text-sm text-brand-charcoal/70 leading-relaxed line-clamp-2">
          {summaryShort}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-brand-light-blue/60 px-2.5 py-0.5 text-xs text-brand-blue"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
