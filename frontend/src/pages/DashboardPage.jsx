import { useEffect, useState } from 'react';
import { feedbackApi } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import {
  MessageSquareText,
  Star,
  ThumbsUp,
  ThumbsDown,
  Minus,
  TrendingUp,
  Filter,
  Download,
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Tooltip, Legend, Filler
);

const SOURCE_COLORS = { whatsapp: '#34d399', email: '#6366f1', website: '#a855f7', phone: '#22d3ee', other: '#64748b' };
const RATING_COLORS = ['#fb7185', '#f97316', '#fbbf24', '#a3e635', '#34d399'];

function StatCard({ icon: Icon, label, value, color, glowClass }) {
  return (
    <div className={`card-glow p-5 ${glowClass} animate-slide-up`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState('');
  const [exporting, setExporting] = useState(false);

  const isAdmin = user?.role === 'admin';

  const loadStats = (ownerId = '') => {
    setLoading(true);
    feedbackApi.stats(ownerId)
      .then((res) => setStats(res.data))
      .catch(() => toast('Failed to load dashboard.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleOwnerChange = (e) => {
    const ownerId = e.target.value;
    setSelectedOwner(ownerId);
    loadStats(ownerId);
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const res = await feedbackApi.export(selectedOwner);
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback_export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast('Export downloaded!', 'success');
    } catch {
      toast('Failed to export.', 'error');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-white/10 border-t-accent-blue rounded-full animate-spin" />
    </div>
  );
  if (!stats) return null;

  const sourceLabels = Object.keys(stats.by_source);
  const sourceData = {
    labels: sourceLabels.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [{ data: Object.values(stats.by_source), backgroundColor: sourceLabels.map((s) => SOURCE_COLORS[s] || '#64748b'), borderWidth: 0, hoverOffset: 8 }],
  };

  const ratingLabels = Object.keys(stats.by_rating);
  const ratingData = {
    labels: ratingLabels.map((r) => `${r}★`),
    datasets: [{ data: Object.values(stats.by_rating), backgroundColor: ratingLabels.map((r) => RATING_COLORS[parseInt(r) - 1] || '#64748b'), borderRadius: 8, borderSkipped: false, maxBarThickness: 40 }],
  };

  const monthLabels = Object.keys(stats.by_month || {});
  const monthData = {
    labels: monthLabels.map((m) => { const [y, mo] = m.split('-'); return new Date(y, mo - 1).toLocaleDateString('en', { month: 'short' }); }),
    datasets: [{ label: 'Feedback', data: Object.values(stats.by_month || {}), borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)', borderWidth: 2, fill: true, tension: 0.4, pointBackgroundColor: '#6366f1', pointBorderColor: '#0a0b0f', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6 }],
  };

  const tooltipStyle = { backgroundColor: '#1a1b25', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, titleColor: '#fff', bodyColor: 'rgba(255,255,255,0.7)', padding: 10, cornerRadius: 10, titleFont: { family: 'Plus Jakarta Sans', weight: '600' }, bodyFont: { family: 'Plus Jakarta Sans' } };
  const chartBase = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltipStyle } };
  const axisStyle = { color: 'rgba(255,255,255,0.3)', font: { family: 'Plus Jakarta Sans', size: 11 } };
  const gridStyle = { color: 'rgba(255,255,255,0.04)' };
  const scaleOpts = { x: { grid: { display: false }, border: { display: false }, ticks: axisStyle }, y: { beginAtZero: true, grid: gridStyle, border: { display: false }, ticks: { ...axisStyle, stepSize: 1 } } };

  const selectedOwnerName = selectedOwner
    ? stats.owners?.find((o) => o.id === parseInt(selectedOwner))?.name
    : null;

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            {isAdmin ? 'Admin Dashboard' : `Hello, ${user?.name?.split(' ')[0]}`}
          </h2>
          <p className="text-white/40 text-sm mt-1">
            {isAdmin
              ? selectedOwnerName
                ? `Showing data for ${selectedOwnerName}`
                : 'Showing all feedback across all owners'
              : 'Your feedback analytics at a glance.'
            }
          </p>
        </div>

        {/* Export button — admin only */}
        {isAdmin && (
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn-ghost text-xs"
          >
            {exporting ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            Export CSV
          </button>
        )}
      </div>

      {/* Owner filter — admin only */}
      {isAdmin && stats.owners && stats.owners.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-4 h-4 text-accent-blue" />
          <select
            value={selectedOwner}
            onChange={handleOwnerChange}
            className="input-field max-w-xs text-sm"
          >
            <option value="">All owners ({stats.total_count} total)</option>
            {stats.owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} — {o.feedback_count} feedback{o.feedback_count !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Owner indicator — owner only */}
      {!isAdmin && (
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-accent-blue" />
          <span className="text-xs text-white/40">
            Filtered by owner: <span className="text-accent-blue font-medium">{user?.name}</span>
          </span>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={MessageSquareText} label="Total" value={stats.total_count} color="bg-accent-blue/15 text-accent-blue" glowClass="stat-glow-blue" />
        <StatCard icon={ThumbsUp} label="Positive" value={stats.positive_count} color="bg-accent-emerald/15 text-accent-emerald" glowClass="stat-glow-emerald" />
        <StatCard icon={ThumbsDown} label="Negative" value={stats.negative_count} color="bg-accent-rose/15 text-accent-rose" glowClass="stat-glow-rose" />
        <StatCard icon={Minus} label="Neutral" value={stats.neutral_count} color="bg-white/10 text-white/50" glowClass="" />
        <StatCard icon={Star} label="Avg Rating" value={stats.average_rating || 'N/A'} color="bg-accent-amber/15 text-accent-amber" glowClass="stat-glow-amber" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="card-glow p-6">
          <h3 className="text-sm font-semibold text-white/70 mb-5">By Source</h3>
          {sourceLabels.length > 0 ? (
            <>
              <div className="h-48 flex items-center justify-center"><Doughnut data={sourceData} options={{ ...chartBase, cutout: '68%' }} /></div>
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {sourceLabels.map((s) => (
                  <div key={s} className="flex items-center gap-1.5 text-[11px] text-white/40">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SOURCE_COLORS[s] }} />
                    {s.charAt(0).toUpperCase() + s.slice(1)} <span className="text-white/20">({stats.by_source[s]})</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-sm text-white/20 text-center py-12">No data yet.</p>}
        </div>

        <div className="card-glow p-6">
          <h3 className="text-sm font-semibold text-white/70 mb-5">Rating Distribution</h3>
          {ratingLabels.length > 0 ? <div className="h-56"><Bar data={ratingData} options={{ ...chartBase, scales: scaleOpts }} /></div> : <p className="text-sm text-white/20 text-center py-12">No data yet.</p>}
        </div>

        <div className="card-glow p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white/70">Monthly Trend</h3>
            <TrendingUp className="w-4 h-4 text-accent-blue" />
          </div>
          {monthLabels.length > 0 ? <div className="h-56"><Line data={monthData} options={{ ...chartBase, scales: scaleOpts }} /></div> : <p className="text-sm text-white/20 text-center py-12">Not enough data.</p>}
        </div>
      </div>

      {/* Recent feedback */}
      <div className="card-glow">
        <div className="px-6 py-4 border-b border-glass-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white/70">Recent Feedback</h3>
          <span className="text-[11px] text-white/20">Last 5 entries</span>
        </div>
        {stats.latest?.length > 0 ? (
          <div className="divide-y divide-glass-border">
            {stats.latest.map((fb, i) => (
              <div key={fb.id} className="px-6 py-4 flex items-start gap-4 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-[11px] font-bold text-white/60 shrink-0">
                  {fb.first_name?.charAt(0)}{fb.last_name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white/80">{fb.first_name} {fb.last_name}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => <Star key={s} className={`w-3 h-3 ${s <= fb.rating ? 'text-accent-amber fill-accent-amber' : 'text-white/10'}`} />)}
                    </div>
                  </div>
                  <p className="text-sm text-white/50 line-clamp-1">{fb.comment}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium capitalize" style={{ backgroundColor: `${SOURCE_COLORS[fb.source]}15`, color: SOURCE_COLORS[fb.source] }}>{fb.source}</span>
                    <span className="text-[11px] text-white/20">{new Date(fb.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-14 text-center"><p className="text-sm text-white/20">No feedback yet.</p></div>
        )}
      </div>
    </div>
  );
}