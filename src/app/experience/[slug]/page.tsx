import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import Badge from "@/components/ui/Badge";
import ScoreBadge from "@/components/experience/ScoreBadge";
import ExperienceCard from "@/components/experience/ExperienceCard";
import { db } from "@/lib/db";
import { experiences } from "@/lib/db/schema";
import { eq, desc, and, ne, or, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getExperience(slug: string) {
  const rows = await db
    .select()
    .from(experiences)
    .where(eq(experiences.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const experience = await getExperience(slug);

  if (!experience) {
    return { title: "Experience Not Found" };
  }

  return {
    title: experience.title,
    description: experience.summaryShort,
    openGraph: {
      title: `${experience.title} | fai.events`,
      description: experience.summaryShort,
      type: "article",
      ...(experience.imageUrl ? { images: [{ url: experience.imageUrl }] } : {}),
    },
  };
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const percentage = Math.min(100, Math.max(0, score));
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-brand-charcoal/70">{label}</span>
        <span className="text-sm font-bold text-brand-charcoal">{score}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-blue/70 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const experience = await getExperience(slug);

  if (!experience) {
    notFound();
  }

  const tags = experience.tags
    ? experience.tags.split(",").map((t) => t.trim())
    : [];

  // Related experiences: same category or province, excluding current
  const related = await db
    .select()
    .from(experiences)
    .where(
      and(
        eq(experiences.status, "approved"),
        ne(experiences.id, experience.id),
        or(
          eq(experiences.category, experience.category),
          eq(experiences.province, experience.province)
        )
      )
    )
    .orderBy(desc(experiences.aiScore))
    .limit(3);

  const relatedMapped = related.map((row) => ({
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    destination: row.destination,
    province: row.province,
    category: row.category,
    summaryShort: row.summaryShort,
    imageUrl: row.imageUrl ?? undefined,
    aiScore: row.aiScore,
    tags: row.tags ? row.tags.split(",").map((t) => t.trim()) : [],
    isFeatured: row.isFeatured === 1,
  }));

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative min-h-[50vh] flex items-end overflow-hidden">
          {experience.imageUrl ? (
            <img
              src={experience.imageUrl}
              alt={experience.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue/90 to-brand-charcoal" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <Container className="relative z-10 pb-12 pt-32">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="default" className="bg-white/90 text-brand-blue backdrop-blur-sm">
                {experience.category}
              </Badge>
              <ScoreBadge score={experience.aiScore} className="text-sm px-3 py-1" />
              {experience.isFeatured === 1 && (
                <Badge variant="yellow" className="bg-brand-yellow/90 text-brand-charcoal">
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-4xl">
              {experience.title}
            </h1>
            <div className="flex items-center gap-2 mt-4 text-white/80">
              <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-lg">
                {experience.destination}, {experience.province}
              </span>
            </div>
          </Container>
        </section>

        {/* Content */}
        <section className="py-12 bg-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-10">
                {/* About */}
                <div>
                  <h2 className="text-2xl font-bold text-brand-charcoal mb-4">
                    About This Experience
                  </h2>
                  <div className="prose prose-lg max-w-none text-brand-charcoal/80 leading-relaxed">
                    {experience.summaryLong.split("\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Why It's Special */}
                {experience.whySpecial && (
                  <div className="rounded-2xl bg-brand-light-blue p-8">
                    <h3 className="text-xl font-bold text-brand-charcoal mb-3 flex items-center gap-2">
                      <svg className="h-6 w-6 text-brand-yellow" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      Why It&apos;s Special
                    </h3>
                    <p className="text-brand-charcoal/80 leading-relaxed">
                      {experience.whySpecial}
                    </p>
                  </div>
                )}

                {/* AI Reasoning */}
                {experience.aiReasoning && (
                  <div className="rounded-2xl border border-brand-blue/20 p-8">
                    <h3 className="text-xl font-bold text-brand-charcoal mb-3 flex items-center gap-2">
                      <svg className="h-6 w-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                      AI Analysis
                    </h3>
                    <p className="text-brand-charcoal/70 leading-relaxed text-sm">
                      {experience.aiReasoning}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-brand-charcoal mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="default">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Score Breakdown */}
                <div className="rounded-2xl border border-gray-100 p-6 space-y-5">
                  <h3 className="text-lg font-bold text-brand-charcoal">AI Score Breakdown</h3>
                  <ScoreBar label="Overall Score" score={experience.aiScore} />
                  {experience.uniquenessScore != null && (
                    <ScoreBar label="Uniqueness" score={experience.uniquenessScore} />
                  )}
                  {experience.luxuryScore != null && (
                    <ScoreBar label="Luxury" score={experience.luxuryScore} />
                  )}
                  {experience.authenticityScore != null && (
                    <ScoreBar label="Authenticity" score={experience.authenticityScore} />
                  )}
                </div>

                {/* Practical Info */}
                <div className="rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-brand-charcoal mb-4">Details</h3>
                  <dl className="space-y-4">
                    {experience.priceRange && (
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/50">
                          Price Range
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-brand-charcoal">
                          {experience.priceRange}
                          {experience.priceNote && (
                            <span className="block text-xs text-brand-charcoal/50 mt-0.5">
                              {experience.priceNote}
                            </span>
                          )}
                        </dd>
                      </div>
                    )}
                    {experience.duration && (
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/50">
                          Duration
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-brand-charcoal">
                          {experience.duration}
                        </dd>
                      </div>
                    )}
                    {experience.bestTimeToVisit && (
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/50">
                          Best Time to Visit
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-brand-charcoal">
                          {experience.bestTimeToVisit}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/50">
                        Province
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-brand-charcoal">
                        {experience.province}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/50">
                        Category
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-brand-charcoal">
                        {experience.category}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Links */}
                <div className="rounded-2xl border border-gray-100 p-6 space-y-3">
                  <h3 className="text-lg font-bold text-brand-charcoal mb-4">Links</h3>
                  {experience.websiteUrl && (
                    <a
                      href={experience.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg bg-brand-blue px-4 py-3 text-sm font-semibold text-white hover:brightness-110 transition-all"
                    >
                      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
                      </svg>
                      Visit Website
                    </a>
                  )}
                  {experience.bookingUrl && (
                    <a
                      href={experience.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg bg-brand-yellow px-4 py-3 text-sm font-semibold text-brand-charcoal hover:brightness-110 transition-all"
                    >
                      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      Book Now
                    </a>
                  )}
                  {experience.sourceUrl && (
                    <a
                      href={experience.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-brand-charcoal/70 hover:bg-gray-50 transition-all"
                    >
                      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      View Source
                    </a>
                  )}
                  {experience.socialLink && (
                    <a
                      href={experience.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-brand-charcoal/70 hover:bg-gray-50 transition-all"
                    >
                      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                      </svg>
                      Social
                    </a>
                  )}
                  {experience.contactLink && (
                    <a
                      href={experience.contactLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-brand-charcoal/70 hover:bg-gray-50 transition-all"
                    >
                      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      Contact
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Related Experiences */}
        {relatedMapped.length > 0 && (
          <section className="py-16 bg-gray-50">
            <Container>
              <h2 className="text-2xl font-bold text-brand-charcoal mb-8">
                Related Experiences
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedMapped.map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
            </Container>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
