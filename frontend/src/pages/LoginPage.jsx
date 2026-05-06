import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Zap, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else toast(data?.message || 'Login failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-16 relative overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-purple/10 rounded-full blur-[100px]" />

        <div className="relative max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-semibold">
              Feedback<span className="text-accent-blue">OS</span>
            </span>
          </div>

          <h1 className="font-display text-5xl leading-[1.15] mb-6">
            Track every<br />
            client voice<span className="text-accent-blue">.</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed">
            Collect, organize, and analyze feedback from WhatsApp, email,
            phone, and web — all in one powerful dashboard.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['Real-time Analytics', 'Multi-channel', 'Team Filters', 'Smart Charts'].map((f) => (
              <span key={f} className="glass-panel px-3 py-1.5 text-xs text-white/50 font-medium">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-semibold">
              Feedback<span className="text-accent-blue">OS</span>
            </span>
          </div>

          <h2 className="font-display text-3xl font-semibold mb-1">Welcome back</h2>
          <p className="text-white/40 text-sm mb-8">Sign in to access your dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="admin@company.com"
                required
              />
              {errors.email && <p className="text-accent-rose text-xs mt-1">{errors.email[0]}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
              {errors.password && <p className="text-accent-rose text-xs mt-1">{errors.password[0]}</p>}
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-8 glass-panel p-3 text-center">
            <p className="text-[11px] text-white/30">
              <span className="text-white/50 font-medium">Demo:</span>{' '}
              demo@example.com / password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
