import ExperienceCard, { type Experience } from "./ExperienceCard";

interface ExperienceGridProps {
  experiences: Experience[];
}

export default function ExperienceGrid({ experiences }: ExperienceGridProps) {
  if (experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-brand-light-blue flex items-center justify-center mb-4">
          <svg
            className="h-8 w-8 text-brand-blue"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-brand-charcoal">
          No experiences found
        </h3>
        <p className="mt-1 text-sm text-brand-charcoal/60">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {experiences.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  );
}
