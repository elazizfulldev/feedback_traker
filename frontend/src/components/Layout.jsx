import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  MessageSquareText,
  PlusCircle,
  UserPlus,
  LogOut,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/',            label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/feedback',    label: 'Feedback',     icon: MessageSquareText },
  { to: '/feedback/new',label: 'Add Feedback', icon: PlusCircle },
  { to: '/admins/add',  label: 'Add Admin',    icon: UserPlus },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-dark-900 bg-mesh">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] bg-dark-800/80 backdrop-blur-2xl
          border-r border-glass-border flex flex-col transition-transform duration-300 lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              Feedback<span className="text-accent-blue">OS</span>
            </span>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
                ${isActive
                  ? 'bg-accent-blue/15 text-accent-blue shadow-lg shadow-accent-blue/5'
                  : 'text-white/50 hover:text-white/80 hover:bg-glass-hover'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-glass-border">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-purple to-accent-rose flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90 truncate">{user?.name}</p>
              <p className="text-[11px] text-white/30 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-ghost w-full text-xs">
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 h-14 bg-dark-800/80 backdrop-blur-xl border-b border-glass-border flex items-center px-4 gap-3">
          <button onClick={() => setOpen(true)} className="text-white/60">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-display text-base font-semibold">
              Feedback<span className="text-accent-blue">OS</span>
            </span>
          </div>
        </div>

        <div className="p-5 lg:p-8 max-w-7xl animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
