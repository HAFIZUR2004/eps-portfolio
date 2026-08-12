import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 py-12 px-4">
      <div className="w-full max-w-md flex justify-center">
        <SignIn
          appearance={{
            elements: {
              // কার্ড ডিজাইন সিম্পল ও ক্লিন রাখা
              card: "bg-slate-900 border border-slate-800 shadow-xl rounded-2xl p-6",
              headerTitle: "text-white font-bold text-2xl text-center",
              headerSubtitle: "text-slate-400 text-sm text-center",
              
              // ইনপুট বক্স
              formFieldLabel: "text-slate-300 font-medium text-xs mb-1",
              formFieldInput: "bg-slate-950 border border-slate-800 text-white rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all p-3 text-sm",
              
              // মেইন বাটন
              formButtonPrimary: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl py-3 text-sm transition-all mt-2",
              
              // সোশ্যাল (Google/GitHub) বাটন
              socialButtonsBlockButton: "bg-slate-950 border border-slate-800 text-slate-200 hover:bg-slate-800 rounded-xl transition-all",
              socialButtonsBlockButtonText: "text-slate-300 font-medium text-sm",
              
              // ডিভাইডার ও অন্যান্য লিংক
              dividerLine: "bg-slate-800",
              dividerText: "text-slate-500 text-xs font-normal",
              footerActionLink: "text-emerald-400 hover:text-emerald-300 font-medium text-xs",
              footerActionText: "text-slate-400 text-xs",
            },
          }}
        />
      </div>
    </div>
  );
}