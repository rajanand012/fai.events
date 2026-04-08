import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "AI Workshops",
  description:
    "Hands-on AI workshops in Bangkok, Phuket, Chiang Mai, and online. Led by Raj Goodman. Learn to build AI-powered solutions for your business.",
};

const workshopTypes = [
  {
    title: "AI for Business Leaders",
    description:
      "Understand AI strategy, identify opportunities, and lead AI transformation in your organization. Perfect for executives and decision-makers.",
    icon: (
      <svg className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    color: "bg-brand-light-blue",
  },
  {
    title: "Hands-On AI Building",
    description:
      "Build real AI-powered tools and automations in a single day. No coding experience required. Walk away with working projects.",
    icon: (
      <svg className="h-8 w-8 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L12 4.37m-5.68 5.7h11.8M4.26 19.72l15.48-15.48" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 4.5c0 .966-.784 1.75-1.75 1.75S13.75 5.466 13.75 4.5 14.534 2.75 15.5 2.75s1.75.784 1.75 1.75z" />
      </svg>
    ),
    color: "bg-brand-yellow/15",
  },
  {
    title: "Custom Enterprise Workshops",
    description:
      "Tailored AI training for your team or organization. From beginner to advanced, in person or online.",
    icon: (
      <svg className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    color: "bg-brand-light-blue",
  },
];

const locations = [
  {
    name: "Bangkok",
    description:
      "Full-day and half-day workshops in central Bangkok. Ideal for corporate teams and business leaders seeking AI transformation.",
  },
  {
    name: "Phuket",
    description:
      "Combine learning with paradise. Intensive AI workshops in Phuket, perfect for retreats and off-site training events.",
  },
  {
    name: "Chiang Mai",
    description:
      "Creative and focused AI workshops in the cultural capital of northern Thailand. A popular choice for startups and digital nomads.",
  },
  {
    name: "Online",
    description:
      "Join from anywhere in the world. Live, interactive virtual workshops with the same hands-on approach and practical outcomes.",
  },
];

export default function WorkshopsPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-brand-charcoal via-brand-charcoal to-brand-blue py-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-16 right-[10%] h-64 w-64 rounded-full bg-brand-yellow/5 blur-3xl" />
            <div className="absolute bottom-16 left-[5%] h-48 w-48 rounded-full bg-brand-blue/10 blur-3xl" />
          </div>
          <Container className="relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                AI Workshops in{" "}
                <span className="text-brand-yellow">Thailand</span>
              </h1>
              <p className="mt-5 text-xl text-white/80 leading-relaxed">
                Learn to build AI-powered solutions with hands-on workshops led by Raj Goodman.
              </p>
              <a
                href="https://rajgoodman.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-brand-yellow px-7 py-3.5 mt-8 text-base font-semibold text-brand-charcoal transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
              >
                Get in Touch
              </a>
            </div>
          </Container>
        </section>

        {/* Workshop Types */}
        <section className="py-20 bg-white">
          <Container>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal">
                Workshop Formats
              </h2>
              <p className="mt-3 text-lg text-brand-charcoal/60">
                Choose the format that fits your goals
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {workshopTypes.map((workshop) => (
                <div
                  key={workshop.title}
                  className="rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${workshop.color} mb-6`}>
                    {workshop.icon}
                  </div>
                  <h3 className="text-xl font-bold text-brand-charcoal mb-3">
                    {workshop.title}
                  </h3>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    {workshop.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Locations */}
        <section className="py-20 bg-gray-50">
          <Container>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal">
                Locations
              </h2>
              <p className="mt-3 text-lg text-brand-charcoal/60">
                Bangkok, Phuket, Chiang Mai, and Online
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {locations.map((location) => (
                <div
                  key={location.name}
                  className="rounded-2xl bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-bold text-brand-charcoal mb-3">
                    {location.name}
                  </h3>
                  <p className="text-sm text-brand-charcoal/70 leading-relaxed">
                    {location.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* About Raj */}
        <section className="py-20 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
                Your Facilitator
              </h2>
              <div className="mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-to-br from-brand-blue to-brand-charcoal flex items-center justify-center">
                <span className="text-2xl font-extrabold text-white/30">RG</span>
              </div>
              <p className="text-lg text-brand-charcoal/70 leading-relaxed mb-4">
                Raj Goodman is an AI innovator and workshop facilitator based in Bangkok. He builds
                AI-powered solutions that solve real business problems and teaches others to do the
                same through practical, hands-on workshops.
              </p>
              <p className="text-lg text-brand-charcoal/70 leading-relaxed">
                With experience delivering workshops to startups, enterprises, and government
                organisations across Southeast Asia, Raj brings a unique combination of technical
                depth and business acumen to every session.
              </p>
              <a
                href="https://rajgoodman.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-brand-blue font-semibold hover:underline underline-offset-4"
              >
                Learn more at rajgoodman.com
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </Container>
        </section>

        {/* Testimonials Placeholder */}
        <section className="py-20 bg-gray-50">
          <Container>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-brand-charcoal">
                What Participants Say
              </h2>
              <p className="mt-3 text-lg text-brand-charcoal/60">
                Testimonials coming soon
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white p-8 shadow-sm"
                >
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="h-5 w-5 text-brand-yellow/30"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-5/6 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-4/6 mb-6" />
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100" />
                    <div>
                      <div className="h-3 bg-gray-100 rounded w-24 mb-1.5" />
                      <div className="h-2.5 bg-gray-100 rounded w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-br from-brand-blue to-brand-charcoal">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-10">
                Whether you are a business leader looking to understand AI strategy, or a team
                wanting to build real AI tools, there is a workshop for you.
              </p>
              <a
                href="https://rajgoodman.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-brand-yellow px-8 py-4 text-lg font-bold text-brand-charcoal transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
              >
                Contact Raj Goodman
              </a>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
