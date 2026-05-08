import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usersApi } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import {
  UserPlus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
  User,
} from 'lucide-react';

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = useCallback(
    (p = 1) => {
      setLoading(true);
      usersApi
        .list(p)
        .then((res) => {
          setUsers(res.data.data);
          setMeta(res.data);
          setPage(p);
        })
        .catch(() => toast('Failed to load users.', 'error'))
        .finally(() => setLoading(false));
    },
    [toast]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? All their feedback will be deleted too.`)) return;
    setDeletingId(id);
    try {
      await usersApi.delete(id);
      toast('User deleted.', 'success');
      fetchUsers(page);
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to delete.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Users</h2>
          <p className="text-white/40 text-sm mt-1">{meta?.total ?? 0} total accounts</p>
        </div>
        <Link to="/users/new" className="btn-primary">
          <UserPlus className="w-4 h-4" />
          Add User
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-white/10 border-t-accent-blue rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="card-glow flex flex-col items-center justify-center py-16">
          <Users className="w-10 h-10 text-white/10 mb-3" />
          <p className="text-white/30 text-sm mb-4">No users yet.</p>
          <Link to="/users/new" className="btn-primary text-sm">
            <UserPlus className="w-4 h-4" /> Add first user
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {users.map((u, i) => (
              <div
                key={u.id}
                className="card-glow p-5 flex items-center gap-4 animate-slide-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Avatar */}
                {u.avatar_url ? (
                  <img
                    src={u.avatar_url}
                    alt={u.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white/90">{u.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium capitalize ${
                        u.role === 'admin'
                          ? 'bg-accent-purple/15 text-accent-purple'
                          : 'bg-accent-blue/15 text-accent-blue'
                      }`}
                    >
                      {u.role === 'admin' ? (
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" /> admin
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> owner
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-white/30 mt-0.5">{u.email}</p>
                  <p className="text-[10px] text-white/15 mt-0.5">
                    Joined {new Date(u.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to={`/users/${u.id}/edit`}
                    state={{ user: u }}
                    className="p-2 rounded-lg text-white/20 hover:text-white/60 hover:bg-glass-hover transition-all"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(u.id, u.name)}
                    disabled={deletingId === u.id}
                    className="p-2 rounded-lg text-white/20 hover:text-accent-rose hover:bg-accent-rose/10 transition-all disabled:opacity-40"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => fetchUsers(page - 1)}
                disabled={page <= 1}
                className="btn-ghost text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <span className="text-sm text-white/30 font-mono">
                {page} / {meta.last_page}
              </span>
              <button
                onClick={() => fetchUsers(page + 1)}
                disabled={page >= meta.last_page}
                className="btn-ghost text-xs"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}