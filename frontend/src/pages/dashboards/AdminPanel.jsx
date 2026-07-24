import React, { useEffect, useState } from 'react';
import { ShieldAlert, Users, Loader2, CheckCircle, XCircle } from 'lucide-react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 className="anton" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-forest)', margin: 0 }}>
          <div style={{ background: '#ffe0b2', padding: '0.5rem', borderRadius: '1rem', display: 'flex' }}>
            <ShieldAlert style={{ color: '#e65100' }} />
          </div>
          ADMINISTRATOR DASHBOARD
        </h2>
        <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>System-wide administration and management.</p>
      </div>

      <div style={{ background: 'white', border: '2px solid var(--color-olive)', borderRadius: '2rem', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '2px solid var(--color-olive)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-cream)' }}>
          <h3 className="anton" style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users style={{ color: 'var(--color-forest)' }} />
            REGISTERED USERS
          </h3>
          <span className="label-text" style={{ background: 'var(--color-forest)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
            {users.length} USERS
          </span>
        </div>
        
        {isLoading ? (
          <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" style={{ color: 'var(--color-forest)' }} size={32} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--color-cream)', borderBottom: '2px solid var(--color-olive)' }}>
                <tr>
                  <th className="label-text" style={{ padding: '1rem 1.5rem', color: 'var(--color-forest)' }}>NAME</th>
                  <th className="label-text" style={{ padding: '1rem 1.5rem', color: 'var(--color-forest)' }}>EMAIL</th>
                  <th className="label-text" style={{ padding: '1rem 1.5rem', color: 'var(--color-forest)' }}>ROLES</th>
                  <th className="label-text" style={{ padding: '1rem 1.5rem', color: 'var(--color-forest)', textAlign: 'center' }}>VERIFIED</th>
                  <th className="label-text" style={{ padding: '1rem 1.5rem', color: 'var(--color-forest)' }}>JOINED</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(1, 71, 46, 0.1)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>{u.firstName} {u.lastName}</td>
                    <td style={{ padding: '1rem 1.5rem', opacity: 0.8 }}>{u.email}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {u.roles.map(r => (
                          <span key={r} className="label-text" style={{ 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '1rem',
                            background: r === 'ROLE_ADMIN' ? '#ffe0b2' : r === 'ROLE_MANAGER' ? 'var(--color-sage)' : 'var(--color-olive)',
                            color: r === 'ROLE_ADMIN' ? '#e65100' : 'var(--color-forest)'
                          }}>
                            {r.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      {u.emailVerified ? 
                        <CheckCircle size={20} style={{ color: 'var(--color-forest)', margin: '0 auto' }} /> : 
                        <XCircle size={20} style={{ color: 'rgba(1, 71, 46, 0.3)', margin: '0 auto' }} />}
                    </td>
                    <td className="label-text" style={{ padding: '1rem 1.5rem', opacity: 0.6 }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', opacity: 0.5 }}>
                      <span className="label-text">NO USERS FOUND.</span>
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
