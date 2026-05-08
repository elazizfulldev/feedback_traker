import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { usersApi } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Save, ArrowLeft, UserPlus, Shield, User } from 'lucide-react';

export default function UserFormPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const existing = location.state?.user;
  const isEdit = Boolean(id && existing);

  const [form, setForm] = useState({
    name:     existing?.name ?? '',
    email:    existing?.email ?? '',
    password: '',
    role:     existing?.role ?? 'owner',
  });
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
      // F l'edit, ila password vide, ma nsiftouhsh
      const data = { ...form };
      if (isEdit && !data.password) {
        delete data.password;
      }

      if (isEdit) {
        await usersApi.update(id, data);
        toast('User updated!', 'success');
      } else {
        await usersApi.create(data);
        toast('User created!', 'success');
      }
      navigate('/users');
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors) setErrors(res.errors);
      else toast(res?.message || 'Something went wrong.', 'error');
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
        <div className="w-10 h-10 rounded-xl bg-accent-cyan/15 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-accent-cyan" />
        </div>
        <h2 className="font-display text-2xl font-semibold">
          {isEdit ? 'Edit User' : 'New User'}
        </h2>
      </div>
      <p className="text-white/40 text-sm mb-8 pl-[52px]">
        {isEdit ? 'Update user account details.' : 'Create a new user account.'}
      </p>

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
            {errors.name && <p className="text-accent-rose text-xs mt-1">{errors.name[0]}</p>}
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
              placeholder="user@company.com"
              required
            />
            {errors.email && <p className="text-accent-rose text-xs mt-1">{errors.email[0]}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5">
              Password {isEdit && <span className="text-white/20">(leave empty to keep current)</span>}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input-field"
              placeholder={isEdit ? '••••••••' : 'Min. 8 characters'}
              required={!isEdit}
            />
            {errors.password && <p className="text-accent-rose text-xs mt-1">{errors.password[0]}</p>}
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2">
              Role
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, role: 'owner' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all
                  ${form.role === 'owner'
                    ? 'bg-accent-blue/15 text-accent-blue border-accent-blue/30'
                    : 'bg-glass-white text-white/40 border-glass-border hover:border-white/20'
                  }`}
              >
                <User className="w-4 h-4" />
                Owner
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, role: 'admin' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all
                  ${form.role === 'admin'
                    ? 'bg-accent-purple/15 text-accent-purple border-accent-purple/30'
                    : 'bg-glass-white text-white/40 border-glass-border hover:border-white/20'
                  }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            </div>
            {errors.role && <p className="text-accent-rose text-xs mt-1">{errors.role[0]}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? 'Update' : 'Create'} User
                </>
              )}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}