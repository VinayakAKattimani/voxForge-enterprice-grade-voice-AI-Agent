import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardData } from '../data/mockData';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { IconMic, IconHistory, IconWifi, IconArrowRight } from '../components/ui/icons';
import './dashboard.css';

const STATUS_VARIANT = { Resolved: 'success', Escalated: 'warning', Abandoned: 'danger' };

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboardData().then(setData);
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="container-page">
      <div className="dash-greeting" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22 }}>{greeting}, {firstName}</h2>
          <p className="dash-greeting-sub">Here&apos;s how your voice assistants are performing today.</p>
        </div>
        <Button icon={<IconMic width={16} height={16} />} onClick={() => navigate('/conversation')}>
          Start a conversation
        </Button>
      </div>

      {!data ? (
        <SkeletonStats />
      ) : (
        <>
          <div className="dash-stats-grid">
            <StatCard label="Active conversations" value={data.stats.activeConversations} delta="4 in the last hour" deltaDirection="up" icon={<IconMic width={16} height={16} />} />
            <StatCard label="Total conversations" value={data.stats.totalConversations.toLocaleString()} delta="12% vs last month" deltaDirection="up" icon={<IconHistory width={16} height={16} />} />
            <StatCard label="Avg. AI response latency" value={data.stats.avgLatencyMs} suffix="ms" delta="22ms faster" deltaDirection="up" icon={<IconWifi width={16} height={16} />} />
            <StatCard label="Resolution rate" value={`${Math.round(data.stats.resolutionRate * 100)}%`} delta="2pts vs last week" deltaDirection="up" icon={<IconArrowRight width={16} height={16} />} />
          </div>

          <div className="dash-main-grid">
            <Card
              title="Recent conversations"
              subtitle="Latest activity across all assistants"
              actions={<Button variant="ghost" size="sm" onClick={() => navigate('/history')}>View all</Button>}
            >
              <div>
                {data.recent.map((c) => (
                  <div key={c.id} className="recent-convo-row">
                    <div style={{ minWidth: 0 }}>
                      <div className="recent-convo-title">{c.title}</div>
                      <div className="recent-convo-meta">{c.channel} · {c.duration} · {timeAgo(c.updatedAt)}</div>
                    </div>
                    <Badge variant={STATUS_VARIANT[c.status] || 'neutral'} dot>{c.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card title="Voice usage" subtitle="This billing cycle">
                <div className="stat-card-value" style={{ fontSize: 22 }}>
                  {data.stats.voiceMinutesThisMonth.toLocaleString()} <span style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>/ {data.stats.voiceMinutesQuota.toLocaleString()} min</span>
                </div>
                <div className="usage-bar-track">
                  <div className="usage-bar-fill" style={{ width: `${Math.min(100, (data.stats.voiceMinutesThisMonth / data.stats.voiceMinutesQuota) * 100)}%` }} />
                </div>
                <div className="usage-row">
                  <span>{Math.round((data.stats.voiceMinutesThisMonth / data.stats.voiceMinutesQuota) * 100)}% used</span>
                  <span>Resets in 12 days</span>
                </div>
              </Card>

              <Card title="Latency trend" subtitle="Last 7 days, ms">
                <div className="latency-sparkline">
                  {data.trend.map((v, i) => (
                    <div key={i} className="latency-bar" style={{ height: `${(v / Math.max(...data.trend)) * 100}%` }} title={`${v}ms`} />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SkeletonStats() {
  return (
    <div className="dash-stats-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 104, borderRadius: 12 }} />
      ))}
    </div>
  );
}
