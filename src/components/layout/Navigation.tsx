import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useState } from "react";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string; description?: string }[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About us",
    children: [
      {
        label: "Advertisers",
        href: "/about-us/advertisers",
        description: "Advertisers",
      },
      { label: "Board of Consultants", href: "/about-us/board-of-consultants", description: "Meet our team" },
      { label: "Endorsement", href: "/about-us/endorsement", description: "Endorsement" },
    ],
  },
  {
    label: "Magazines",
    href: "/magazines",
  },
  {
    label: "Events",
    children: [
      { label: "Roadmap", href: "/roadmap", description: "Industry roadmaps" },
      {
        label: "Roadshow",
        href: "/roadshow",
        description: "Upcoming roadshows",
      },
      {
        label: "Proseries",
        href: "/proseries",
        description: "Professional series events",
      },
      {
        label: "Exclusive Events",
        href: "/seminar",
        description: "Exclusive events",
      },
      {
        label: "Exhibitions",
        href: "/exhibitions",
        description: "Exhibitions",
      },
    ],
  },
  { label: "Services",
    children: [
      { label: "Contact Publication", href: "/services/contact-publication", description: "Contact Publication" },
      { label: "Anniversary & Annual Report", href: "/services/annual-report", description: "Anniversary & Annual Report" },
      { label: "Company Profile & Product Catalogue", href: "/services/product-catalogue", description: "Company Profile & Product Catalogue" },
      { label: "Event Organizer", href: "/services/event-organizer", description: "Event Organizer" },
    ],
   },
  { label: "Contact Us", href: "/contact-us" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const baseUrl = import.meta.env.BASE_URL;
  
  // Helper to prepend baseUrl to internal paths
  const withBase = (path: string) => {
    if (path === "/") return baseUrl;
    return `${baseUrl}${path.slice(1)}`; // Remove leading slash and prepend baseUrl
  };

  return (
    <>
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <a href={baseUrl} className="shrink-0 flex gap-2">
          <img
            src={`${baseUrl}images/be-media-logo.png`}
            alt="Bemedia Focus logo"
            className="h-10 pr-0.5"
          />
          <div className="border-r-2 border-gray-200" />
          <img
            src={`${baseUrl}images/FFT-logo.png`}
            alt="Food Focus Thailand logo"
            className="h-10"
          />
        </a>

        {/* Desktop Navigation */}
        <NavigationMenu.Root className="hidden lg:block relative text-black/80">
          <NavigationMenu.List className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavigationMenu.Item key={item.label} className="relative">
                {item.children ? (
                  <>
                    <NavigationMenu.Trigger className="group flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-[#3A5F47] transition-colors rounded-md hover:bg-white/10 cursor-pointer">
                      {item.label}
                      <svg
                        className="w-3 h-3 transition-transform group-data-[state=open]:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content className=" top-0 left-0 w-[280px] bg-white rounded-lg shadow-lg border p-3 mt-2 z-50">
                      <ul className="grid gap-1">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <NavigationMenu.Link asChild>
                              <a
                                href={withBase(child.href)}
                                className="block p-3 rounded-md hover:bg-[#CBE5D5] transition-colors"
                              >
                                <div className="font-medium text-[#2d3319]">
                                  {child.label}
                                </div>
                              </a>
                            </NavigationMenu.Link>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenu.Content>
                  </>
                ) : (
                  <NavigationMenu.Link asChild>
                    <a
                      href={withBase(item.href!)}
                      className="px-3 py-2 text-sm font-medium hover:text-[#3A5F47] transition-colors rounded-md"
                    >
                      {item.label}
                    </a>
                  </NavigationMenu.Link>
                )}
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>

          <NavigationMenu.Viewport className="absolute left-0 top-full flex justify-center" />
        </NavigationMenu.Root>

        {/* Right side: Search */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles, news, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-4 pr-10 py-2 text-sm bg-white/45 rounded-full text-gray-700 placeholder:text-gray-800/30 focus:outline-none focus:border-white/40 min-w-72"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-md text-white hover:bg-white/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden py-4 border-t border-gray-700">
          {/* Mobile Search */}
          <div className="px-3 pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <details className="group">
                    <summary className="flex items-center justify-between px-3 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-md cursor-pointer list-none">
                      {item.label}
                      <svg
                        className="w-4 h-4 transition-transform group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="pl-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={withBase(child.href)}
                          className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </details>
                ) : (
                  <a
                    href={withBase(item.href!)}
                    className="block px-3 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-md"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
