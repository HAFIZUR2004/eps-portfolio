import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Star, Users, MessageSquare, CheckCircle2 } from "lucide-react";

// Clerk Session Claims Interface Define
interface CustomJwtPayload {
  metadata?: {
    role?: string;
  };
}

export default async function DashboardOverview() {
  const user = await currentUser();
  const { sessionClaims } = await auth();

  // Type assertion for sessionClaims
  const customClaims = sessionClaims as unknown as CustomJwtPayload;

  // Role Check: Verify if the user is Admin
  const isAdmin = customClaims?.metadata?.role === "admin";

  if (!isAdmin) {
    redirect("/"); // Non-admin users are redirected back to home page
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-slate-800/80">
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.firstName || "Admin"}! 👋
        </h2>
        <p className="text-slate-400 text-sm">
          Manage your portfolio reviews, client feedback, and website metrics from here.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">Total Reviews</span>
            <Star className="text-amber-400" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-white">24</p>
          <span className="text-[11px] text-emerald-400 font-medium">+4 this week</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">Pending Approvals</span>
            <MessageSquare className="text-amber-500" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-white">3</p>
          <span className="text-[11px] text-amber-400 font-medium">Requires action</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">Approved Reviews</span>
            <CheckCircle2 className="text-emerald-400" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-white">21</p>
          <span className="text-[11px] text-slate-500 font-medium">Active on site</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">Total Users</span>
            <Users className="text-blue-400" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-white">18</p>
          <span className="text-[11px] text-slate-500 font-medium">Registered Clients</span>
        </div>
      </div>
    </div>
  );
}