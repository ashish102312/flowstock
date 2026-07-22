import React, { useEffect, useState } from 'react';
import { User, Activity, MonitorSmartphone, Loader2, Clock, ShieldCheck } from 'lucide-react';
import { usersApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function UserPanel({ user }) {
  const [sessions, setSessions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      usersApi.getMySessions(),
      usersApi.getMyAuditLogs(0, 5) // fetch 5 most recent
    ])
      .then(([sessionsRes, logsRes]) => {
        setSessions(sessionsRes.data.data);
        setLogs(logsRes.data.data);
      })
      .catch((err) => {
        toast.error('Failed to load user activity');
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <User className="text-brand-400 w-6 h-6" /> 
          My Dashboard
        </h2>
        <p className="text-white/40 mt-1">View your profile, security settings, and recent activities.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-10 bg-white/5 border border-white/10 rounded-xl mt-6">
          <Loader2 className="w-6 h-6 animate-spin text-white/50" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          {/* Active Sessions */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
              <MonitorSmartphone className="w-5 h-5 text-brand-400" />
              <h3 className="font-semibold text-white">Active Sessions</h3>
            </div>
            <div className="divide-y divide-white/5 flex-1">
              {sessions.filter(s => s.status === 'ACTIVE').map(session => (
                <div key={session.id} className="p-5 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white">{session.os} • {session.browser}</p>
                      <p className="text-sm text-white/50 mt-1">{session.ipAddress}</p>
                    </div>
                    <span className="text-xs font-semibold bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-white/40">
                    <Clock className="w-3.5 h-3.5" />
                    Last active: {new Date(session.lastActiveAt).toLocaleString()}
                  </div>
                </div>
              ))}
              {sessions.filter(s => s.status === 'ACTIVE').length === 0 && (
                <div className="p-6 text-center text-white/40 text-sm">No active sessions.</div>
              )}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-400" />
              <h3 className="font-semibold text-white">Recent Activity</h3>
            </div>
            <div className="divide-y divide-white/5 flex-1">
              {logs.map(log => (
                <div key={log.id} className="p-5 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-white/40" />
                        {log.action.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-white/50 mt-1">{log.details}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      log.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="p-6 text-center text-white/40 text-sm">No recent activity.</div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
