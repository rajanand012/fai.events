import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              fai
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-yellow mx-0.5 translate-y-[-2px]" />
              events
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Extraordinary, AI-curated experiences across Thailand. Discover hidden gems and unforgettable adventures tailored just for you.
            </p>
            <p className="text-xs text-white/50 mt-3">
              Built with Claude AI and Claude Code
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-yellow mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/explore", label: "Experiences" },
                { href: "/#workshops", label: "Workshops" },
                { href: "/#about", label: "About" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-brand-yellow transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-yellow mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://rajgoodman.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-brand-yellow transition-colors"
                >
                  rajgoodman.com
                </a>
              </li>
              <li>
                <Link
                  href="/experience/ai-workshop-raj-goodman-bangkok"
                  className="text-sm text-white/70 hover:text-brand-yellow transition-colors"
                >
                  AI Workshops across Thailand
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-yellow mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white/70 hover:text-brand-yellow transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-white/70 hover:text-brand-yellow transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} fai.events. All rights reserved.
          </p>
          <p className="text-sm text-white/40">
            A{" "}
            <a
              href="https://rajgoodman.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-brand-yellow transition-colors"
            >
              Raj Goodman
            </a>
            {" "}project, powered by Claude AI
          </p>
        </div>
      </div>
    </footer>
  );
}
