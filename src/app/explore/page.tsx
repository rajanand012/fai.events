import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import ExperienceGrid from "@/components/experience/ExperienceGrid";
import ExperienceFilters from "@/components/experience/ExperienceFilters";
import { db } from "@/lib/db";
import { experiences, categories, provinces } from "@/lib/db/schema";
import { eq, desc, asc, and, like, or, sql } from "drizzle-orm";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore Experiences",
  description:
    "Browse AI-curated extraordinary experiences across Thailand. Filter by category, province, and more.",
};

const PAGE_SIZE = 12;

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    province?: string;
    sort?: string;
    page?: string;
  }>;
}

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

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const categorySlug = params.category ?? "";
  const provinceSlug = params.province ?? "";
  const sort = params.sort ?? "score";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  // Build filter conditions
  const conditions = [eq(experiences.status, "approved")];

  if (q) {
    conditions.push(
      or(
        like(experiences.title, `%${q}%`),
        like(experiences.destination, `%${q}%`),
        like(experiences.summaryShort, `%${q}%`)
      )!
    );
  }

  if (categorySlug) {
    // Experiences store category values like "wellness", "workshops", "fine-dining"
    // Category filter pills send slugs from the categories table like "wellness-spa", "workshops"
    // Try exact match first, then match by category table name
    const matchCat = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);

    if (matchCat.length > 0) {
      // Match against both the slug and the lowercase name
      const catName = matchCat[0].name.toLowerCase();
      conditions.push(
        or(
          eq(experiences.category, categorySlug),
          eq(experiences.category, catName),
          like(experiences.category, `${categorySlug.split('-')[0]}%`)
        )!
      );
    } else {
      conditions.push(eq(experiences.category, categorySlug));
    }
  }

  if (provinceSlug) {
    const matchProv = await db
      .select()
      .from(provinces)
      .where(eq(provinces.slug, provinceSlug))
      .limit(1);
    if (matchProv.length > 0) {
      conditions.push(eq(experiences.province, matchProv[0].name));
    }
  }

  // Determine sort
  const orderBy =
    sort === "newest"
      ? desc(experiences.publishedAt)
      : sort === "title"
        ? asc(experiences.title)
        : desc(experiences.aiScore);

  const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

  // Total count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(experiences)
    .where(whereClause);
  const totalCount = countResult[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Fetch experiences
  const rows = await db
    .select()
    .from(experiences)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const experienceList = rows.map(mapExperience);

  // Fetch filter options
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.displayOrder);
  const allProvinces = await db
    .select()
    .from(provinces)
    .orderBy(provinces.name);

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-charcoal to-brand-blue py-16">
          <Container>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Explore Experiences
            </h1>
            <p className="mt-3 text-lg text-white/70">
              {totalCount} extraordinary {totalCount === 1 ? "experience" : "experiences"} across Thailand
            </p>
          </Container>
        </section>

        {/* Filters + Results */}
        <section className="py-10 bg-gray-50 min-h-screen">
          <Container>
            <ExperienceFilters
              categories={allCategories}
              provinces={allProvinces}
            />

            <div className="mt-10">
              <ExperienceGrid experiences={experienceList} />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                {page > 1 ? (
                  <Link
                    href={`/explore?${new URLSearchParams({
                      ...(q ? { q } : {}),
                      ...(categorySlug ? { category: categorySlug } : {}),
                      ...(provinceSlug ? { province: provinceSlug } : {}),
                      ...(sort !== "score" ? { sort } : {}),
                      page: String(page - 1),
                    }).toString()}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-brand-charcoal hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-300 cursor-not-allowed">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </span>
                )}

                <span className="text-sm text-brand-charcoal/60">
                  Page {page} of {totalPages}
                </span>

                {page < totalPages ? (
                  <Link
                    href={`/explore?${new URLSearchParams({
                      ...(q ? { q } : {}),
                      ...(categorySlug ? { category: categorySlug } : {}),
                      ...(provinceSlug ? { province: provinceSlug } : {}),
                      ...(sort !== "score" ? { sort } : {}),
                      page: String(page + 1),
                    }).toString()}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-brand-charcoal hover:bg-gray-50 transition-colors"
                  >
                    Next
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-300 cursor-not-allowed">
                    Next
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </div>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
