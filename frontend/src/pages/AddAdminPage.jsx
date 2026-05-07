import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { UserPlus, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AddAdminPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      // On appelle l'API DIRECTEMENT — pas useAuth().register()
      // Comme ça on ne change PAS le token ni le user connecté
      const res = await api.post('/register', form);

      setCreated(res.data.user);
      toast('Admin created successfully!', 'success');
      setForm({ name: '', email: '', password: '', password_confirmation: '' });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else {
        toast(data?.message || 'Failed to create admin.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg animate-slide-up">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-accent-purple/15 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-accent-purple" />
        </div>
        <h2 className="font-display text-2xl font-semibold">Add Admin</h2>
      </div>
      <p className="text-white/40 text-sm mb-8 pl-[52px]">
        Create a new admin account to access the dashboard.
      </p>

      {created && (
        <div className="card-glow p-4 mb-6 flex items-start gap-3 border-accent-emerald/20">
          <ShieldCheck className="w-5 h-5 text-accent-emerald mt-0.5" />
          <div>
            <p className="text-sm font-medium text-accent-emerald">Admin created!</p>
            <p className="text-xs text-white/40 mt-1">
              {created.name} ({created.email}) can now log in.
            </p>
          </div>
        </div>
      )}

      <div className="card-glow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5">
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input-field"
              placeholder="John Doe"
              required
            />
            {errors.name && (
              <p className="text-accent-rose text-xs mt-1">{errors.name[0]}</p>
            )}
          </div>

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
            {errors.email && (
              <p className="text-accent-rose text-xs mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                placeholder="Min. 8 chars"
                required
              />
              {errors.password && (
                <p className="text-accent-rose text-xs mt-1">{errors.password[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5">
                Confirm
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full mt-2"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Admin Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
