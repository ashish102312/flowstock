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
      usersApi.getMyAuditLogs(0, 5)
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 className="anton" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-forest)', margin: 0 }}>
          <div style={{ background: 'var(--color-sage)', padding: '0.5rem', borderRadius: '1rem', display: 'flex' }}>
            <User style={{ color: 'var(--color-forest)' }} />
          </div>
          MY DASHBOARD
        </h2>
        <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>View your profile, security settings, and recent activities.</p>
      </div>

      {isLoading ? (
        <div style={{ background: 'white', padding: '4rem', borderRadius: '2rem', display: 'flex', justifyContent: 'center', border: '2px solid var(--color-olive)' }}>
          <Loader2 className="animate-spin" style={{ color: 'var(--color-forest)' }} size={32} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Active Sessions */}
          <div style={{ background: 'white', border: '2px solid var(--color-olive)', borderRadius: '2rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', borderBottom: '2px solid var(--color-olive)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--color-cream)' }}>
              <MonitorSmartphone style={{ color: 'var(--color-forest)' }} />
              <h3 className="anton" style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-forest)' }}>ACTIVE SESSIONS</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {sessions.filter(s => s.status === 'ACTIVE').map(session => (
                <div key={session.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-olive)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>{session.os} • {session.browser}</p>
                      <p className="label-text" style={{ opacity: 0.5, margin: 0 }}>{session.ipAddress}</p>
                    </div>
                    <span className="label-text" style={{ background: 'var(--color-sage)', color: 'var(--color-forest)', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>
                      ACTIVE
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', opacity: 0.5 }}>
                    <Clock size={14} />
                    <span className="label-text">LAST ACTIVE: {new Date(session.lastActiveAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {sessions.filter(s => s.status === 'ACTIVE').length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                  <p className="label-text">NO ACTIVE SESSIONS.</p>
                </div>
              )}
            </div>
          </div>

          {/* Audit Logs */}
          <div style={{ background: 'white', border: '2px solid var(--color-olive)', borderRadius: '2rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', borderBottom: '2px solid var(--color-olive)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--color-cream)' }}>
              <Activity style={{ color: 'var(--color-forest)' }} />
              <h3 className="anton" style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-forest)' }}>RECENT ACTIVITY</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {logs.map(log => (
                <div key={log.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-olive)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldCheck size={16} style={{ opacity: 0.5 }} />
                        {log.action.replace(/_/g, ' ')}
                      </p>
                      <p className="label-text" style={{ opacity: 0.5, margin: 0, marginTop: '0.5rem' }}>{log.details}</p>
                    </div>
                    <span className="label-text" style={{ 
                      background: log.status === 'SUCCESS' ? 'var(--color-sage)' : '#ffe0b2', 
                      color: log.status === 'SUCCESS' ? 'var(--color-forest)' : '#e65100', 
                      padding: '0.25rem 0.5rem', borderRadius: '1rem' 
                    }}>
                      {log.status}
                    </span>
                  </div>
                  <p className="label-text" style={{ opacity: 0.4, marginTop: '1rem' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
              {logs.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                  <p className="label-text">NO RECENT ACTIVITY.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
