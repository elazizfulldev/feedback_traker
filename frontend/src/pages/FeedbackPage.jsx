import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { feedbackApi } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Plus, Pencil, Trash2, Star, ChevronLeft, ChevronRight, MessageSquareText, Mail, Phone } from 'lucide-react';

const SOURCE_COLORS = { whatsapp: '#34d399', email: '#6366f1', website: '#a855f7', phone: '#22d3ee', other: '#64748b' };

export default function FeedbackPage() {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchFeedback = useCallback((p = 1) => {
    setLoading(true);
    feedbackApi.list(p)
      .then((res) => { setFeedback(res.data.data); setMeta(res.data); setPage(p); })
      .catch(() => toast('Failed to load feedback.', 'error'))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    setDeletingId(id);
    try { await feedbackApi.delete(id); toast('Feedback deleted.', 'success'); fetchFeedback(page); }
    catch { toast('Failed to delete.', 'error'); }
    finally { setDeletingId(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Feedback</h2>
          <p className="text-white/40 text-sm mt-1">{meta?.total ?? 0} total entries</p>
        </div>
        <Link to="/feedback/new" className="btn-primary"><Plus className="w-4 h-4" /> Add New</Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-white/10 border-t-accent-blue rounded-full animate-spin" /></div>
      ) : feedback.length === 0 ? (
        <div className="card-glow flex flex-col items-center justify-center py-16">
          <MessageSquareText className="w-10 h-10 text-white/10 mb-3" />
          <p className="text-white/30 text-sm mb-4">No feedback yet.</p>
          <Link to="/feedback/new" className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add first feedback</Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {feedback.map((fb, i) => (
              <div key={fb.id} className="card-glow p-5 flex items-start gap-4 animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
                  {fb.first_name?.charAt(0)}{fb.last_name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-semibold text-white/90">{fb.first_name} {fb.last_name}</span>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map((s) => <Star key={s} className={`w-3 h-3 ${s <= fb.rating ? 'text-accent-amber fill-accent-amber' : 'text-white/10'}`} />)}</div>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed mb-2">{fb.comment}</p>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium capitalize" style={{ backgroundColor: `${SOURCE_COLORS[fb.source]}15`, color: SOURCE_COLORS[fb.source] }}>{fb.source}</span>
                    {fb.email && <span className="text-[10px] text-white/20 flex items-center gap-1"><Mail className="w-3 h-3" /> {fb.email}</span>}
                    {fb.phone && <span className="text-[10px] text-white/20 flex items-center gap-1"><Phone className="w-3 h-3" /> {fb.phone}</span>}
                    <span className="text-[10px] text-white/15">{new Date(fb.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link to={`/feedback/${fb.id}/edit`} state={{ feedback: fb }} className="p-2 rounded-lg text-white/20 hover:text-white/60 hover:bg-glass-hover transition-all" title="Edit"><Pencil className="w-4 h-4" /></Link>
                  <button onClick={() => handleDelete(fb.id)} disabled={deletingId === fb.id} className="p-2 rounded-lg text-white/20 hover:text-accent-rose hover:bg-accent-rose/10 transition-all disabled:opacity-40" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={() => fetchFeedback(page - 1)} disabled={page <= 1} className="btn-ghost text-xs"><ChevronLeft className="w-3.5 h-3.5" /> Previous</button>
              <span className="text-sm text-white/30 font-mono">{page} / {meta.last_page}</span>
              <button onClick={() => fetchFeedback(page + 1)} disabled={page >= meta.last_page} className="btn-ghost text-xs">Next <ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
