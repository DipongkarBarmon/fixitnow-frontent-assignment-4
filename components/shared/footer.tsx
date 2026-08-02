import Link from "next/link";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";
import { Container } from "./container";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  services: [
    { title: "Plumbing", href: "/services?category=plumbing" },
    { title: "Electrical", href: "/services?category=electrical" },
    { title: "Cleaning", href: "/services?category=cleaning" },
    { title: "Painting", href: "/services?category=painting" },
    { title: "All Services", href: "/services" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "How It Works", href: "/how-it-works" },
    { title: "Careers", href: "/careers" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
  ],
  support: [
    { title: "Help Center", href: "/help" },
    { title: "Safety", href: "/safety" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "FAQ", href: "/#faq" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <Container>
        <div className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Wrench className="size-6 text-blue-600" />
              <span className="text-xl font-bold text-neutral-900 dark:text-white">
                FixItNow
              </span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs">
              Your trusted marketplace for professional home services. Find,
              book, and manage services with ease.
            </p>
            <div className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <Mail className="size-4" />
                <span>support@fixitnow.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">
              Services
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">
              Support
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} FixItNow. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
