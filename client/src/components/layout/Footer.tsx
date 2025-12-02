import { Link } from "wouter";
import { SiFacebook, SiLinkedin, SiX, SiInstagram } from "react-icons/si";

export function Footer() {
  const footerLinks = {
    Products: [
      { label: "Resume Builder", href: "/builder" },
      { label: "Cover Letter Builder", href: "/cover-letter" },
      { label: "Resume Templates", href: "/templates" },
      { label: "Resume Examples", href: "/resources" },
    ],
    Resources: [
      { label: "How to Write a Resume", href: "/resources" },
      { label: "Resume Format Guide", href: "/resources" },
      { label: "Cover Letter Examples", href: "/resources" },
      { label: "Career Blog", href: "/resources" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
    Support: [
      { label: "Help Center", href: "/help" },
      { label: "FAQ", href: "/faq" },
      { label: "Pricing", href: "/pricing" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  };

  const socialLinks = [
    { icon: SiFacebook, href: "#", label: "Facebook" },
    { icon: SiLinkedin, href: "#", label: "LinkedIn" },
    { icon: SiX, href: "#", label: "X" },
    { icon: SiInstagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/">
              <span className="text-2xl font-bold text-white cursor-pointer">
                resume<span className="text-primary">guru</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-xs">
              Create professional resumes in minutes with our AI-powered builder. 
              Trusted by millions of job seekers worldwide.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <span className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} ResumeGuru. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/terms">
                <span className="text-gray-400 hover:text-white cursor-pointer">Terms of Service</span>
              </Link>
              <Link href="/privacy">
                <span className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</span>
              </Link>
              <Link href="/cookies">
                <span className="text-gray-400 hover:text-white cursor-pointer">Cookie Policy</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
