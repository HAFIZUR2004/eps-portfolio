// app/dashboard/layout.tsx

import Link from "next/link";
import Image from "next/image"; // 👈 Image component import করা হলো
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Star, Users, Settings, ArrowLeft } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 border-r border-slate-800/80 p-5 flex flex-col justify-between backdrop-blur-md">
        <div>
          {/* Logo / Brand - Click to Redirect Home */}
          <Link href="/" className="flex items-center mb-8 px-2 group">
            <Image
              src="/logo2.png" // 👈 ডাইনামিক লোগো URL
              alt="Dashboard Logo"
              width={150}
              height={40}
              className="object-contain h-10 w-auto group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-emerald-400 transition-all"
            >
              <LayoutDashboard size={18} />
              Overview
            </Link>

            <Link
              href="/dashboard/reviews"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-emerald-400 transition-all"
            >
              <Star size={18} />
              Review Management
            </Link>

            <Link
              href="/dashboard/users"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-emerald-400 transition-all"
            >
              <Users size={18} />
              User Management
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-emerald-400 transition-all"
            >
              <Settings size={18} />
              Site Settings
            </Link>
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
            Portfolio Management System
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