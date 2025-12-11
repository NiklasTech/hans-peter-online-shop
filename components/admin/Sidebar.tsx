"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
} from "lucide-react";

interface SidebarProps {
  isAdmin?: boolean;
}

const adminLinks = [
  { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produkte", href: "/admin/products", icon: Package },
  { name: "Kategorien", href: "/admin/categories", icon: Grid3X3 },
  { name: "Marken", href: "/admin/brands", icon: Palette },
  { name: "Benutzer", href: "/admin/users", icon: Users },
];

export default function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isLinkActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const SidebarLink = ({
    name,
    href,
    icon: Icon,
  }: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => {
    const isActive = isLinkActive(href);
    return (
      <Link href={href}>
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive
              ? "bg-blue-500 text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
          } ${!isOpen ? "justify-center" : ""}`}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {isOpen && (
            <span className="font-medium text-sm whitespace-nowrap">
              {name}
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`hidden md:flex absolute top-[73px] z-30 p-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-r-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 ${
          isOpen ? "left-60" : "left-14"
        }`}
      >
        <ChevronLeft
          className={`h-5 w-5 text-gray-700 dark:text-gray-300 transition-transform duration-300 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>

      {/* Mobile Burger Menu Button - Only shows when admin */}
      {isAdmin && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden fixed top-[85px] left-4 z-40 p-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg shadow-md transition-all duration-200"
        >
          {isMobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      )}

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-20 top-[73px]"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`hidden md:flex md:flex-col transition-all duration-300 ease-in-out bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-gray-800 overflow-y-auto ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Admin Section */}
          {isAdmin && (
            <div className="space-y-3">
              {isOpen && (
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider animate-fade-in">
                  Admin Panel
                </h3>
              )}
              <nav className="space-y-2">
                {adminLinks.map((link) => (
                  <SidebarLink
                    key={link.href}
                    name={link.name}
                    href={link.href}
                    icon={link.icon}
                  />
                ))}
              </nav>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed left-0 top-[73px] z-30 h-[calc(100vh-73px)] w-64 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-gray-800 overflow-y-auto transition-all duration-300 ease-in-out ${
          isMobileOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Admin Section */}
          {isAdmin && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Admin Panel
              </h3>
              <nav className="space-y-2">
                {adminLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
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
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
