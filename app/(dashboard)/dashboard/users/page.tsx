import { ShieldCheck, User } from "lucide-react";

const sampleUsers = [
  {
    id: "usr_1",
    name: "Hafizur Rahman",
    email: "hafiz@growbusinessbd.com",
    role: "admin",
    joinedDate: "Jan 15, 2026",
  },
  {
    id: "usr_2",
    name: "David Miller",
    email: "david@example.com",
    role: "client",
    joinedDate: "Aug 10, 2026",
  },
  {
    id: "usr_3",
    name: "Sophie Taylor",
    email: "sophie@example.com",
    role: "client",
    joinedDate: "Aug 08, 2026",
  },
];

export default function UserManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <p className="text-xs text-slate-400 mt-1">
          Registered accounts on your website via Clerk Authentication.
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/50 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sampleUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-xs">
                      {user.role === "admin" ? <ShieldCheck size={14} className="text-emerald-400" /> : <User size={14} />}
                    </div>
                    {user.name}
                  </td>
                  <td className="p-4 text-slate-400">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        user.role === "admin"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{user.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}