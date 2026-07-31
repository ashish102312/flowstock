import React, { useEffect, useState } from 'react';
import { ShieldAlert, Users, Database, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { usersApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminPanel({ user }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    usersApi.getAllUsers()
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => {
        toast.error('Failed to load users');
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShieldAlert className="text-red-400 w-6 h-6" /> 
          Administrator Dashboard
        </h2>
        <p className="text-white/40 mt-1">System-wide administration and management.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-400" />
            Registered Users
          </h3>
          <span className="text-xs font-semibold bg-white/10 px-2.5 py-1 rounded-full text-white/70">
            {users.length} Users
          </span>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="w-6 h-6 animate-spin text-white/50" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-white/5 text-white/50 font-semibold border-b border-white/10">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Roles</th>
                  <th className="px-6 py-3 text-center">Verified</th>
                  <th className="px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{u.firstName} {u.lastName}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map(r => (
                          <span key={r} className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                            r === 'ROLE_ADMIN' ? 'bg-red-500/20 text-red-400' :
                            r === 'ROLE_MANAGER' ? 'bg-brand-500/20 text-brand-400' :
                            'bg-white/10 text-white/60'
                          }`}>
                            {r.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.emailVerified ? 
                        <CheckCircle className="w-5 h-5 text-green-400 mx-auto" /> : 
                        <XCircle className="w-5 h-5 text-white/20 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-white/40">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
