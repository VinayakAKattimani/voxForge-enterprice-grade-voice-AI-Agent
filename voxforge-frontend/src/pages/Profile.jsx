import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Field, Input } from '../components/ui/Field';
import { dashboardStats } from '../data/mockData';
import { IconLogout } from '../components/ui/icons';
import './profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = () => {
    setEditing(false);
    setSavedMsg('Profile updated.');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  return (
    <div className="container-page">
      <div className="profile-header">
        <div className="profile-avatar">{user?.avatarInitials}</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h2 className="profile-name">{user?.name}</h2>
          <div className="profile-meta">{user?.email} · {user?.org}</div>
          <div className="profile-badge-row">
            <Badge variant="info">{user?.role}</Badge>
            <Badge variant="success">{user?.plan} plan</Badge>
          </div>
        </div>
        <Button variant="secondary" icon={<IconLogout width={15} height={15} />} onClick={() => setConfirmLogout(true)}>
          Log out
        </Button>
      </div>

      <div className="profile-grid">
        <Card
          title="Profile details"
          actions={!editing && <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit</Button>}
        >
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Full name">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Work email">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSave}>Save changes</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="profile-stat-row"><span>Full name</span><span>{name}</span></div>
              <div className="profile-stat-row"><span>Work email</span><span>{email}</span></div>
              <div className="profile-stat-row"><span>Organization</span><span>{user?.org}</span></div>
              <div className="profile-stat-row"><span>Role</span><span>{user?.role}</span></div>
              {savedMsg && <p style={{ fontSize: 12.5, color: 'var(--success)', marginTop: 10 }}>{savedMsg}</p>}
            </>
          )}
        </Card>

        <Card title="Usage overview" subtitle="Your activity across VoxForge">
          <div className="profile-stat-row"><span>Total conversations</span><span>{dashboardStats.totalConversations.toLocaleString()}</span></div>
          <div className="profile-stat-row"><span>Voice minutes this month</span><span>{dashboardStats.voiceMinutesThisMonth.toLocaleString()} min</span></div>
          <div className="profile-stat-row"><span>Resolution rate</span><span>{Math.round(dashboardStats.resolutionRate * 100)}%</span></div>
          <div className="profile-stat-row"><span>Avg. response latency</span><span>{dashboardStats.avgLatencyMs}ms</span></div>
        </Card>
      </div>

      <Modal
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        title="Log out of VoxForge?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirmLogout(false)}>Cancel</Button>
            <Button variant="danger" onClick={logout}>Log out</Button>
          </>
        }
      >
        You'll need to sign in again to access your dashboard and conversations.
      </Modal>
    </div>
  );
}
