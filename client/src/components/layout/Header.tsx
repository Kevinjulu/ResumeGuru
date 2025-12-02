import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, FileText, Briefcase, GraduationCap, BookOpen, DollarSign } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      label: "Builders",
      items: [
        { label: "Resume Builder", href: "/builder", icon: FileText, description: "Build your resume step by step" },
        { label: "Cover Letter Builder", href: "/cover-letter", icon: Briefcase, description: "Create matching cover letters" },
      ],
    },
    { label: "Resumes", href: "/templates" },
    { label: "Cover Letters", href: "/cover-letters" },
    { label: "CVs", href: "/cvs" },
    { label: "Resources", href: "/resources" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-2xl font-bold text-gray-900">
                resume<span className="text-primary">guru</span>
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    {item.items ? (
                      <>
                        <NavigationMenuTrigger className="text-gray-700 hover:text-gray-900 font-medium">
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4">
                            {item.items.map((subItem) => (
                              <li key={subItem.href}>
                                <NavigationMenuLink asChild>
                                  <Link href={subItem.href}>
                                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                      <subItem.icon className="w-5 h-5 text-primary mt-0.5" />
                                      <div>
                                        <div className="font-medium text-gray-900">{subItem.label}</div>
                                        <div className="text-sm text-gray-500">{subItem.description}</div>
                                      </div>
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link href={item.href!}>
                        <NavigationMenuLink
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                            location === item.href
                              ? "text-primary"
                              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="font-medium" data-testid="button-login">
                Login
              </Button>
            </Link>
            <Link href="/builder">
              <Button className="font-medium bg-primary hover:bg-primary/90" data-testid="button-build-resume">
                Build My Resume
              </Button>
            </Link>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/builder" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full font-medium" data-testid="button-mobile-build">
                    Build My Resume
                  </Button>
                </Link>
                <div className="border-t pt-4">
                  {navItems.map((item) => (
                    <div key={item.label} className="py-2">
                      {item.items ? (
                        <div className="space-y-2">
                          <div className="font-medium text-gray-900 px-2">{item.label}</div>
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setMobileOpen(false)}
                            >
                              <div className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md cursor-pointer">
                                <subItem.icon className="w-4 h-4" />
                                {subItem.label}
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link href={item.href!} onClick={() => setMobileOpen(false)}>
                          <div
                            className={`px-2 py-2 font-medium rounded-md cursor-pointer ${
                              location === item.href
                                ? "text-primary"
                                : "text-gray-700 hover:text-gray-900"
                            }`}
                          >
                            {item.label}
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full" data-testid="button-mobile-login">
                      Login
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
