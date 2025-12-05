import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, FileText, Settings, LogOut } from "lucide-react";
import { navItems } from "@/lib/navigation";

export function Header() {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      if (!data) return null;
      return data;
    },
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setLocation("/");
    },
  });



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
                      // Check if user is logged in for "My Resumes"
                      (item.href === '/my-resumes' && !user) || (item.href === '/my-cover-letters' && !user) ? null : (
                        <NavigationMenuLink asChild>
                          <Link href={item.href!}>
                            <span
                              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${location === item.href
                                ? "text-primary"
                                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                            >
                              {item.label}
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      )
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/builder">
                  <Button className="font-medium bg-primary hover:bg-primary/90" data-testid="button-build-resume">
                    Build My Resume
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border border-gray-200">
                        <AvatarImage src={user.avatarUrl} alt={user.username} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {user.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/my-resumes" className="cursor-pointer w-full flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>My Resumes</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-cover-letters" className="cursor-pointer w-full flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>My Cover Letters</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer w-full flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>My Account</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={() => logoutMutation.mutate()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="font-medium" data-testid="button-login">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="font-medium" data-testid="button-register">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
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
                        // Check if user is logged in for "My Resumes"
                        (item.href === '/my-resumes' && !user) || (item.href === '/my-cover-letters' && !user) ? null : ( // Hide My Resumes/My Cover Letters if not logged in
                          <Link href={item.href!} onClick={() => setMobileOpen(false)}>
                            <div
                              className={`px-2 py-2 font-medium rounded-md cursor-pointer ${location === item.href
                                ? "text-primary"
                                : "text-gray-700 hover:text-gray-900"
                                }`}
                            >
                              {item.label}
                            </div>
                          </Link>
                        )
                      )}
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  {user ? (
                    <>
                      <Link href="/my-resumes" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full">
                          My Resumes
                        </Button>
                      </Link>
                      <Link href="/my-cover-letters" onClick={() => setMobileOpen(false)}> {/* Link to My Cover Letters */}
                        <Button variant="outline" className="w-full">
                          My Cover Letters
                        </Button>
                      </Link>
                      <Link href="/account" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full">
                          My Account
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          logoutMutation.mutate();
                          setMobileOpen(false);
                        }}
                        disabled={logoutMutation.isPending}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full" data-testid="button-mobile-login">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full" data-testid="button-mobile-register">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
