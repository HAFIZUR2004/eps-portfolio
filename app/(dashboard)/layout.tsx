"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  FileText,
  Star,
  Users,
  Handshake,
  MessageSquareQuote,
  Settings,
  ArrowLeft,
  LayoutTemplate,
  HelpCircle,
  List, // 👈 Requirements-এর জন্য নতুন আইকন
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Navigation Items Array
  const navItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Hero Section",
      href: "/dashboard/hero",
      icon: LayoutTemplate,
    },
    {
      name: "Services",
      href: "/dashboard/services",
      icon: Briefcase,
    },
    {
      name: "Blog Management",
      href: "/dashboard/blogs",
      icon: FileText,
    },
    {
      name: "Portfolio",
      href: "/dashboard/portfolio",
      icon: FolderKanban,
    },
    {
      name: "Requirements", // 👈 Requirements যোগ করা হয়েছে
      href: "/dashboard/requirements",
      icon: List,
    },
    {
      name: "FAQ Management",
      href: "/dashboard/faq",
      icon: HelpCircle,
    },
    {
      name: "Trusted Clients",
      href: "/dashboard/clients",
      icon: Handshake,
    },
    {
      name: "Fiverr Reviews",
      href: "/dashboard/fiverreview",
      icon: MessageSquareQuote,
    },
    {
      name: "Review Management",
      href: "/dashboard/reviews",
      icon: Star,
    },
    {
      name: "User Management",
      href: "/dashboard/users",
      icon: Users,
    },
    {
      name: "Site Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 border-r border-slate-800/80 p-5 flex flex-col justify-between backdrop-blur-md">
        <div>
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center mb-8 px-2 group">
            <Image
              src="/logo2.png"
              alt="Dashboard Logo"
              width={150}
              height={40}
              className="object-contain h-10 w-auto group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Dynamic Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Active link checking
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-slate-800 text-emerald-400 font-semibold shadow-sm border border-slate-700/50"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-emerald-400" : "text-slate-400"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to main site */}
        <div className="border-t border-slate-800/80 pt-4 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors px-2"
          >
            <ArrowLeft size={14} /> Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/50 border-b border-slate-800/80 px-6 flex items-center justify-between backdrop-blur-md">
          <h1 className="text-sm font-semibold text-slate-400">
            Admin Management System
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Admin Active
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 md:p-8 flex-1 bg-slate-950">{children}</main>
      </div>
    </div>
  );
}