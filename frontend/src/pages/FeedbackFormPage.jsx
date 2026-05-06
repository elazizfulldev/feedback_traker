import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { feedbackApi } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Save, ArrowLeft, Star, MessageSquareText } from 'lucide-react';

const SOURCES = [
  { value: 'whatsapp', label: 'WhatsApp', emoji: '💬' },
  { value: 'email',    label: 'Email',    emoji: '📧' },
  { value: 'website',  label: 'Website',  emoji: '🌐' },
  { value: 'phone',    label: 'Phone',    emoji: '📞' },
  { value: 'other',    label: 'Other',    emoji: '📋' },
];

export default function FeedbackFormPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const existing = location.state?.feedback;
  const isEdit = Boolean(id && existing);

  const [form, setForm] = useState({
    first_name: existing?.first_name ?? '',
    last_name:  existing?.last_name ?? '',
    email:      existing?.email ?? '',
    phone:      existing?.phone ?? '',
    whatsapp:   existing?.whatsapp ?? '',
    rating:     existing?.rating ?? 0,
    comment:    existing?.comment ?? '',
    source:     existing?.source ?? 'website',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) { setErrors({ rating: ['Please select a rating.'] }); return; }
    setSubmitting(true);
    setErrors({});
    try {
      if (isEdit) { await feedbackApi.update(id, form); toast('Feedback updated!', 'success'); }
      else { await feedbackApi.create(form); toast('Feedback created!', 'success'); }
      navigate('/feedback');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else toast(data?.message || 'Something went wrong.', 'error');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-2xl animate-slide-up">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-accent-blue/15 flex items-center justify-center">
          <MessageSquareText className="w-5 h-5 text-accent-blue" />
        </div>
        <h2 className="font-display text-2xl font-semibold">{isEdit ? 'Edit' : 'New'} Feedback</h2>
      </div>
      <p className="text-white/40 text-sm mb-8 pl-[52px]">
        {isEdit ? 'Update the feedback entry.' : 'Record a new piece of client feedback.'}
      </p>

      <div className="card-glow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Client info */}
          <div>
            <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">Client Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input type="text" name="first_name" value={form.first_name} onChange={handleChange} className="input-field" placeholder="First name" required />
                {errors.first_name && <p className="text-accent-rose text-xs mt-1">{errors.first_name[0]}</p>}
              </div>
              <div>
                <input type="text" name="last_name" value={form.last_name} onChange={handleChange} className="input-field" placeholder="Last name" required />
                {errors.last_name && <p className="text-accent-rose text-xs mt-1">{errors.last_name[0]}</p>}
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div>
            <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">Contact <span className="text-white/15">(at least one)</span></p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="email@client.com" />
                {errors.email && <p className="text-accent-rose text-xs mt-1">{errors.email[0]}</p>}
              </div>
              <div>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+1 234 567 890" />
                {errors.phone && <p className="text-accent-rose text-xs mt-1">{errors.phone[0]}</p>}
              </div>
              <div>
                <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} className="input-field" placeholder="WhatsApp number" />
                {errors.whatsapp && <p className="text-accent-rose text-xs mt-1">{errors.whatsapp[0]}</p>}
              </div>
            </div>
            {errors.contact && <p className="text-accent-rose text-xs mt-2">{errors.contact[0]}</p>}
          </div>

          {/* Rating */}
          <div>
            <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">Rating</p>
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => { setForm((prev) => ({ ...prev, rating: star })); setErrors((prev) => ({ ...prev, rating: null })); }}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star className={`w-8 h-8 transition-colors ${star <= (hoverRating || form.rating) ? 'text-accent-amber fill-accent-amber' : 'text-white/10'}`} />
                </button>
              ))}
              {form.rating > 0 && <span className="ml-3 text-sm text-white/30 font-mono">{form.rating}/5</span>}
            </div>
            {errors.rating && <p className="text-accent-rose text-xs mt-1">{errors.rating[0]}</p>}
          </div>

          {/* Source */}
          <div>
            <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">Source</p>
            <div className="flex flex-wrap gap-2">
              {SOURCES.map(({ value, label, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, source: value }))}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all
                    ${form.source === value
                      ? 'bg-accent-blue/15 text-accent-blue border-accent-blue/30'
                      : 'bg-glass-white text-white/40 border-glass-border hover:border-white/20 hover:text-white/60'
                    }`}
                >
                  {emoji} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">Comment</p>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              rows={4}
              className="input-field resize-none"
              placeholder="What did the client say?"
              required
            />
            <div className="flex justify-between mt-1.5">
              {errors.comment ? <p className="text-accent-rose text-xs">{errors.comment[0]}</p> : <span />}
              <span className="text-[11px] text-white/20 font-mono">{form.comment.length}/2000</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Save className="w-4 h-4" /> {isEdit ? 'Update' : 'Save'} Feedback</>
              )}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
