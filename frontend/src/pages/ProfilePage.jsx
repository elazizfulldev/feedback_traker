import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileApi } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Camera, Save, Lock, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passForm, setPassForm] = useState({
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handlePassChange = (e) => {
    setPassForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const res = await profileApi.update(form);
      toast('Profile updated!', 'success');
      // Refresh la page pour voir les changements dans sidebar
      window.location.reload();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else toast(data?.message || 'Failed to update.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSavingPass(true);
    setErrors({});
    try {
      await profileApi.update(passForm);
      toast('Password updated!', 'success');
      setPassForm({ password: '', password_confirmation: '' });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else toast(data?.message || 'Failed to update.', 'error');
    } finally {
      setSavingPass(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const res = await profileApi.uploadAvatar(file);
      setAvatarPreview(res.data.avatar);
      toast('Avatar uploaded!', 'success');
    } catch {
      toast('Failed to upload avatar.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl animate-slide-up">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-accent-blue/15 flex items-center justify-center">
          <User className="w-5 h-5 text-accent-blue" />
        </div>
        <h2 className="font-display text-2xl font-semibold">Profile</h2>
      </div>
      <p className="text-white/40 text-sm mb-8 pl-[52px]">
        Manage your account information.
      </p>

      {/* Avatar */}
      <div className="card-glow p-6 mb-5 flex items-center gap-6">
        <div className="relative group">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-rose flex items-center justify-center text-2xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            {uploading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Camera className="w-5 h-5 text-white" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpg,image/jpeg,image/png,image/webp"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-white/90">{user?.name}</p>
          <p className="text-xs text-white/30">{user?.email}</p>
          <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-md font-medium capitalize bg-accent-blue/15 text-accent-blue">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Update info */}
      <div className="card-glow p-6 mb-5">
        <h3 className="text-sm font-semibold text-white/70 mb-4">Account Info</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" required />
            {errors.name && <p className="text-accent-rose text-xs mt-1">{errors.name[0]}</p>}
          </div>
          <div>
            <label className="block text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" required />
            {errors.email && <p className="text-accent-rose text-xs mt-1">{errors.email[0]}</p>}
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="card-glow p-6">
        <h3 className="text-sm font-semibold text-white/70 mb-4">Change Password</h3>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5">New password</label>
              <input type="password" name="password" value={passForm.password} onChange={handlePassChange} className="input-field" placeholder="Min. 8 chars" required />
              {errors.password && <p className="text-accent-rose text-xs mt-1">{errors.password[0]}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5">Confirm</label>
              <input type="password" name="password_confirmation" value={passForm.password_confirmation} onChange={handlePassChange} className="input-field" placeholder="••••••••" required />
            </div>
          </div>
          <button type="submit" disabled={savingPass} className="btn-ghost">
            {savingPass ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock className="w-4 h-4" /> Update Password</>}
          </button>
        </form>
      </div>
    </div>
  );
}