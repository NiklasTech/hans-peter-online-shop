"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore, Suspense } from "react";
import {
  Grid3X3,
  LogOut,
  LayoutDashboard,
  Package,
  Palette,
  Users,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import SearchFilter from "@/components/SearchFilter";

interface SidebarProps {
  isAdmin?: boolean;
}

const adminLinks = [
  { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produkte", href: "/admin/products", icon: Package },
  { name: "Kategorien", href: "/admin/categories", icon: Grid3X3 },
  { name: "Marken", href: "/admin/brands", icon: Palette },
  { name: "Benutzer", href: "/admin/users", icon: Users },
  { name: "Bestellungen", href: "/admin/orders", icon: Package },
  { name: "Support", href: "/admin/support", icon: MessageSquare },
];

function useLocalStorageState(key: string, defaultValue: boolean) {
  const getSnapshot = () => {
    const saved = localStorage.getItem(key);
    return saved === "true";
  };

  const getServerSnapshot = () => defaultValue;

  const subscribe = (callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  };

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = (newValue: boolean) => {
    localStorage.setItem(key, String(newValue));
    window.dispatchEvent(new Event("storage"));
  };

  return [value, setValue] as const;
}

export default function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useLocalStorageState("admin-sidebar-open", false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Determine if we're in the admin area
  const isInAdminArea = pathname.startsWith("/admin");

  // Determine if search filter should be shown (product pages, category pages, search page)
  const showSearchFilter =
    !isInAdminArea &&
    (pathname.startsWith("/product") ||
      pathname.startsWith("/category") ||
      pathname.startsWith("/search"));

  // Only show sidebar if there's content to display
  const shouldShowSidebar = showSearchFilter || (isAdmin && isInAdminArea);

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out admin:", error);
    }
  };

  const isLinkActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Don't render anything if sidebar shouldn't be shown
  if (!shouldShowSidebar) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`hidden md:flex fixed top-[85px] z-30 p-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-r-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer shadow-md ${
          isOpen ? "left-64" : "left-0"
        }`}
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Burger Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-[85px] left-4 z-40 p-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg shadow-md transition-all duration-200 cursor-pointer"
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-20 top-[73px]"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex md:flex-col fixed left-0 top-[73px] h-[calc(100vh-73px)] z-20 transition-all duration-300 ease-in-out bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-gray-800 overflow-y-auto ${
          isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Search Filter Section */}
          {showSearchFilter && (
            <Suspense
              fallback={
                <div className="py-4 text-center text-sm text-gray-500">
                  Lädt Filter...
                </div>
              }
            >
              <SearchFilter />
            </Suspense>
          )}

          {/* Admin Section */}
          {isAdmin && isInAdminArea && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Admin Panel
              </h3>
              <nav className="space-y-2">
                {adminLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        isLinkActive(link.href)
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <link.icon className="h-5 w-5 shrink-0" />
                      <span className="font-medium text-sm whitespace-nowrap">
                        {link.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Admin Logout Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleAdminLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 cursor-pointer"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="font-medium text-sm whitespace-nowrap">
                    Admin abmelden
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Spacer for main content */}
      <div
        className={`hidden md:block transition-all duration-300 ease-in-out shrink-0 ${
          isOpen ? "w-64" : "w-0"
        }`}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed left-0 top-[73px] z-30 h-[calc(100vh-73px)] w-64 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-gray-800 overflow-y-auto transition-all duration-300 ease-in-out ${
          isMobileOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Search Filter Section */}
          {showSearchFilter && (
            <Suspense
              fallback={
                <div className="py-4 text-center text-sm text-gray-500">
                  Lädt Filter...
                </div>
              }
            >
              <SearchFilter onClose={() => setIsMobileOpen(false)} />
            </Suspense>
          )}

          {/* Admin Section */}
          {isAdmin && isInAdminArea && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Admin Panel
              </h3>
              <nav className="space-y-2">
                {adminLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        isLinkActive(link.href)
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <link.icon className="h-5 w-5 shrink-0" />
                      <span className="font-medium text-sm whitespace-nowrap">
                        {link.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Admin Logout Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleAdminLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 cursor-pointer"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="font-medium text-sm whitespace-nowrap">
                    Admin abmelden
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
