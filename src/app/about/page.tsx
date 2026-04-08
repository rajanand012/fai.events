import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about fai.events, the AI-powered platform discovering extraordinary experiences across Thailand. Built by Raj Goodman using Claude AI.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-blue to-brand-blue/80 py-24">
          <Container>
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                About fai.events
              </h1>
              <p className="mt-5 text-xl text-white/80 leading-relaxed">
                Where artificial intelligence meets extraordinary travel.
              </p>
            </div>
          </Container>
        </section>

        {/* Mission */}
        <section className="py-20 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
                Discovering Thailand&apos;s Hidden Extraordinary
              </h2>
              <div className="space-y-5 text-lg text-brand-charcoal/70 leading-relaxed">
                <p>
                  fai.events uses artificial intelligence to continuously discover and curate
                  once-in-a-lifetime experiences across Thailand. The platform scans the web daily,
                  evaluates each find against rigorous quality standards, and surfaces only the most
                  exceptional activities for discerning travellers.
                </p>
                <p>
                  From private temple ceremonies to underwater cave explorations, from Michelin-starred
                  chef collaborations to sunrise hot air balloon flights over ancient ruins, fai.events
                  finds the experiences that guidebooks miss and travel agents rarely offer.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Built by Raj Goodman */}
        <section className="py-20 bg-gray-50">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              {/* Photo placeholder */}
              <div className="lg:col-span-2 flex justify-center">
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-charcoal flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-extrabold text-white/20">RG</div>
                    <p className="text-sm text-white/40 mt-2">Photo placeholder</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
                  Built by Raj Goodman
                </h2>
                <div className="space-y-5 text-lg text-brand-charcoal/70 leading-relaxed">
                  <p>
                    Raj Goodman is an AI innovator, workshop facilitator, and the creator of
                    fai.events. Based in Bangkok, Raj builds AI-powered solutions that solve real
                    problems and delivers hands-on AI workshops across Thailand and the wider region.
                  </p>
                  <p>
                    fai.events was built entirely using Claude AI and Claude Code, demonstrating how
                    AI can create genuine value.
                  </p>
                </div>
                <a
                  href="https://rajgoodman.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 text-brand-blue font-semibold hover:underline underline-offset-4"
                >
                  Visit rajgoodman.com
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* How Our AI Works */}
        <section className="py-20 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2 className="text-3xl font-bold text-brand-charcoal">
                How Our AI Works
              </h2>
              <p className="mt-3 text-lg text-brand-charcoal/60">
                A four-stage pipeline that never sleeps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Discovery */}
              <div className="rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light-blue mb-5">
                  <svg className="h-6 w-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-charcoal mb-2">Discovery</h3>
                <p className="text-brand-charcoal/70 leading-relaxed">
                  Our AI scans travel blogs, review sites, social media, and tourism databases daily.
                  It identifies potential experiences that match our criteria for being truly
                  extraordinary.
                </p>
              </div>

              {/* Evaluation */}
              <div className="rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow/15 mb-5">
                  <svg className="h-6 w-6 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-charcoal mb-2">Evaluation</h3>
                <p className="text-brand-charcoal/70 leading-relaxed">
                  Each candidate is analysed across multiple dimensions. The AI reads descriptions,
                  reviews, and context to understand what makes each experience truly special.
                </p>
              </div>

              {/* Scoring */}
              <div className="rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light-blue mb-5">
                  <svg className="h-6 w-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-charcoal mb-2">Scoring</h3>
                <p className="text-brand-charcoal/70 leading-relaxed">
                  A composite score is generated based on uniqueness, luxury appeal, and cultural
                  authenticity. Only experiences scoring above our threshold are approved for the
                  platform.
                </p>
              </div>

              {/* Curation */}
              <div className="rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow/15 mb-5">
                  <svg className="h-6 w-6 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-charcoal mb-2">Curation</h3>
                <p className="text-brand-charcoal/70 leading-relaxed">
                  Approved experiences are enriched with additional details, categorized, and
                  published. Featured picks are highlighted based on seasonal relevance and
                  exceptional quality.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Built with Claude */}
        <section className="py-20 bg-brand-charcoal">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 mb-6">
                <svg className="h-4 w-4 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span className="text-sm font-medium text-brand-yellow">Built with Claude</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Powered by Claude AI
              </h2>
              <p className="text-lg text-white/70 leading-relaxed">
                This platform was built using Claude AI by Anthropic and Claude Code. From the
                discovery engine that finds new experiences, to the evaluation system that scores
                quality, to the code itself, AI is at the heart of everything fai.events does.
              </p>
            </div>
          </Container>
        </section>

        {/* Workshop CTA */}
        <section className="py-20 bg-brand-light-blue">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-brand-charcoal mb-5">
                Want to Build with AI?
              </h2>
              <p className="text-lg text-brand-charcoal/70 leading-relaxed mb-8">
                Raj Goodman delivers hands-on AI workshops across Thailand and online. Learn to
                harness AI for your business and build real solutions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/workshops"
                  className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:brightness-110"
                >
                  Explore Workshops
                </Link>
                <a
                  href="https://rajgoodman.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-blue px-7 py-3.5 text-base font-semibold text-brand-blue transition-all duration-200 hover:bg-brand-blue hover:text-white"
                >
                  Visit rajgoodman.com
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
