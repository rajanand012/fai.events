import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import ExperienceGrid from "@/components/experience/ExperienceGrid";
import ExperienceCard from "@/components/experience/ExperienceCard";
import { db } from "@/lib/db";
import { experiences, categories } from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

function mapExperience(row: typeof experiences.$inferSelect) {
  return {
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
  };
}

export default async function HomePage() {
  // Featured experiences: top 6 featured first, then fill with highest-scored approved
  const featuredRows = await db
    .select()
    .from(experiences)
    .where(and(eq(experiences.status, "approved"), eq(experiences.isFeatured, 1)))
    .orderBy(desc(experiences.aiScore))
    .limit(6);

  let featured = featuredRows.map(mapExperience);

  if (featured.length < 6) {
    const existingIds = featuredRows.map((r) => r.id);
    const fillRows = await db
      .select()
      .from(experiences)
      .where(
        and(
          eq(experiences.status, "approved"),
          existingIds.length > 0
            ? sql`${experiences.id} NOT IN (${sql.join(existingIds.map((id) => sql`${id}`), sql`, `)})`
            : sql`1=1`
        )
      )
      .orderBy(desc(experiences.aiScore))
      .limit(6 - featured.length);
    featured = [...featured, ...fillRows.map(mapExperience)];
  }

  // Categories
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.displayOrder);

  // Workshop experiences
  const workshopRows = await db
    .select()
    .from(experiences)
    .where(and(eq(experiences.status, "approved"), eq(experiences.category, "workshops")))
    .orderBy(desc(experiences.aiScore));
  const workshops = workshopRows.map(mapExperience);

  // Dynamic stats for hero
  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(experiences)
    .where(eq(experiences.status, "approved"));
  const totalExperiences = totalCountResult[0]?.count ?? 0;

  const destinationCountResult = await db
    .select({ count: sql<number>`count(distinct ${experiences.destination})` })
    .from(experiences)
    .where(eq(experiences.status, "approved"));
  const totalDestinations = destinationCountResult[0]?.count ?? 0;

  // Latest discoveries
  const latestRows = await db
    .select()
    .from(experiences)
    .where(eq(experiences.status, "approved"))
    .orderBy(desc(experiences.publishedAt))
    .limit(4);
  const latest = latestRows.map(mapExperience);

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* ==================== HERO ==================== */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-charcoal via-brand-charcoal to-brand-blue">
          {/* Decorative floating dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-[10%] h-2 w-2 rounded-full bg-brand-yellow/30 animate-pulse" />
            <div className="absolute top-40 right-[15%] h-3 w-3 rounded-full bg-brand-yellow/20 animate-pulse [animation-delay:1s]" />
            <div className="absolute bottom-40 left-[20%] h-2.5 w-2.5 rounded-full bg-brand-light-blue/20 animate-pulse [animation-delay:0.5s]" />
            <div className="absolute top-60 left-[50%] h-1.5 w-1.5 rounded-full bg-brand-yellow/25 animate-pulse [animation-delay:1.5s]" />
            <div className="absolute bottom-60 right-[25%] h-2 w-2 rounded-full bg-brand-light-blue/15 animate-pulse [animation-delay:2s]" />
            <div className="absolute top-32 right-[40%] h-3 w-3 rounded-full bg-brand-yellow/15 animate-pulse [animation-delay:0.8s]" />
            <div className="absolute bottom-32 left-[60%] h-2 w-2 rounded-full bg-brand-light-blue/20 animate-pulse [animation-delay:1.2s]" />
          </div>

          <Container className="relative z-10 py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                Thailand&apos;s Most Extraordinary{" "}
                <span className="text-brand-yellow">Experiences</span>,{" "}
                Curated Daily
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl">
                Every day, our discovery engine surfaces hidden gems, luxury escapes,
                and once-in-a-lifetime adventures across Thailand. Only the best make the cut.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center rounded-lg bg-brand-yellow px-7 py-3.5 text-base font-semibold text-brand-charcoal transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
                >
                  Explore All Experiences
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/50"
                >
                  How It Works
                </a>
              </div>

              {/* Stat bar */}
              <div className="mt-12 flex flex-wrap items-center gap-6 text-white/60 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
                  {totalExperiences}+ Curated Experiences
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
                  {totalDestinations}+ Destinations
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
                  Updated Daily
                </div>
              </div>
            </div>
          </Container>

          {/* Wave separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              preserveAspectRatio="none"
            >
              <path
                d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="white"
              />
            </svg>
          </div>
        </section>

        {/* ==================== FEATURED EXPERIENCES ==================== */}
        <section className="py-20 bg-white">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal">
                Featured Experiences
              </h2>
              <p className="mt-3 text-lg text-brand-charcoal/60">
                Hand-picked for their extraordinary quality
              </p>
            </div>
            <ExperienceGrid experiences={featured} />
            <div className="mt-12 text-center">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:underline underline-offset-4"
              >
                View All Experiences
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </Container>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <Container>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal">
                How It Works
              </h2>
              <p className="mt-3 text-lg text-brand-charcoal/60">
                An always-on discovery engine, curated daily
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Card 1: We Discover */}
              <div className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light-blue">
                  <svg className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <div className="absolute top-4 right-4 text-5xl font-extrabold text-brand-light-blue">1</div>
                <h3 className="text-xl font-bold text-brand-charcoal mb-3">We Discover</h3>
                <p className="text-brand-charcoal/70 leading-relaxed">
                  Our discovery engine scans hundreds of sources daily to find extraordinary experiences
                  across Thailand&apos;s most compelling destinations.
                </p>
              </div>

              {/* Card 2: We Evaluate */}
              <div className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-yellow/15">
                  <svg className="h-8 w-8 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <div className="absolute top-4 right-4 text-5xl font-extrabold text-brand-yellow/20">2</div>
                <h3 className="text-xl font-bold text-brand-charcoal mb-3">We Evaluate</h3>
                <p className="text-brand-charcoal/70 leading-relaxed">
                  Each discovery is rigorously scored on uniqueness, luxury, and authenticity.
                  Only the finest experiences make the cut.
                </p>
              </div>

              {/* Card 3: You Experience */}
              <div className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light-blue">
                  <svg className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <div className="absolute top-4 right-4 text-5xl font-extrabold text-brand-light-blue">3</div>
                <h3 className="text-xl font-bold text-brand-charcoal mb-3">You Experience</h3>
                <p className="text-brand-charcoal/70 leading-relaxed">
                  Browse a curated collection of verified, exceptional activities.
                  Book directly with confidence.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================== CATEGORY SHOWCASE ==================== */}
        {allCategories.length > 0 && (
          <section className="py-20 bg-white">
            <Container>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal">
                  Explore by Category
                </h2>
                <p className="mt-3 text-lg text-brand-charcoal/60">
                  Find your perfect Thai adventure
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCategories.map((cat, index) => (
                  <Link
                    key={cat.id}
                    href={`/explore?category=${cat.slug}`}
                    className="group relative rounded-2xl overflow-hidden p-8 min-h-[160px] flex flex-col justify-end transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <div
                      className={`absolute inset-0 ${
                        index % 2 === 0
                          ? "bg-gradient-to-br from-brand-blue to-brand-blue/80"
                          : "bg-gradient-to-br from-brand-yellow/90 to-brand-yellow/70"
                      } transition-opacity group-hover:opacity-90`}
                    />
                    <div className="relative z-10">
                      <h3
                        className={`text-xl font-bold ${
                          index % 2 === 0 ? "text-white" : "text-brand-charcoal"
                        }`}
                      >
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p
                          className={`mt-2 text-sm leading-relaxed ${
                            index % 2 === 0 ? "text-white/80" : "text-brand-charcoal/70"
                          }`}
                        >
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* ==================== WORKSHOPS ==================== */}
        <section id="workshops" className="py-20 bg-brand-charcoal">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Workshops
              </h2>
              <p className="mt-3 text-lg text-white/70">
                World-class workshops and intensives available across Thailand
              </p>
            </div>

            {/* Dynamic workshop cards from DB */}
            {workshops.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {workshops.map((workshop) => (
                  <Link
                    key={workshop.id}
                    href={`/experience/${workshop.slug}`}
                    className="group rounded-2xl border border-white/10 overflow-hidden hover:border-brand-yellow/30 transition-all duration-300"
                  >
                    {workshop.imageUrl && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={workshop.imageUrl}
                          alt={workshop.title}
                          className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center rounded-full bg-brand-yellow/10 px-3 py-1 text-xs font-medium text-brand-yellow">
                          {workshop.destination}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-yellow transition-colors">
                        {workshop.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                        {workshop.summaryShort}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link
                href="/explore?category=workshops"
                className="inline-flex items-center justify-center rounded-lg bg-brand-yellow px-7 py-3.5 text-base font-semibold text-brand-charcoal transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
              >
                View All Workshops
              </Link>
            </div>
          </Container>
        </section>

        {/* ==================== ABOUT / BUILT BY RAJ ==================== */}
        <section id="about" className="py-20 bg-white">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-yellow/10 px-4 py-2 mb-6">
                <span className="h-2 w-2 rounded-full bg-brand-yellow" />
                <span className="text-sm font-medium text-brand-charcoal">About the Creator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-charcoal mb-4">
                Built by Raj Goodman
              </h2>
              <p className="text-brand-charcoal/70 leading-relaxed mb-6">
                AI innovator, workshop facilitator, and keynote speaker for EO and YPO chapters
                worldwide. Raj is a fractional Chief AI Officer who helps businesses unlock the
                potential of AI. Based in the region, he built fai.events to showcase what AI can
                do when pointed at something extraordinary.
              </p>
              <a
                href="https://rajgoodman.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:underline underline-offset-4"
              >
                rajgoodman.com
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </Container>
        </section>

        {/* ==================== LATEST DISCOVERIES ==================== */}
        {latest.length > 0 && (
          <section className="py-20 bg-gray-50">
            <Container>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal">
                  Fresh Discoveries
                </h2>
                <p className="mt-3 text-lg text-brand-charcoal/60">
                  The newest additions to our curated collection
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latest.map((exp) => (
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
