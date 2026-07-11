import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Field, Input, Select, Switch } from '../components/ui/Field';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { languageOptions, voiceOptions } from '../data/mockData';
import { IconSun, IconMoon } from '../components/ui/icons';
import './settings.css';

const SECTIONS = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'language-voice', label: 'Language & voice' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'account', label: 'Account' },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [active, setActive] = useState('appearance');
  const [language, setLanguage] = useState(languageOptions[0]);
  const [voice, setVoice] = useState(voiceOptions[0].id);
  const [notifs, setNotifs] = useState({ email: true, sms: false, weekly: true, incidents: true });
  const [savedMsg, setSavedMsg] = useState('');

  const save = (msg) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 2000);
  };

  const scrollTo = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="container-page">
      <h2 style={{ fontSize: 20, marginBottom: 4 }}>Settings</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginBottom: 24 }}>
        Manage how VoxForge looks, sounds, and notifies your team.
      </p>

      <div className="settings-grid">
        <nav className="settings-nav">
          {SECTIONS.map((s) => (
            <button key={s.id} className={`settings-nav-item ${active === s.id ? 'active' : ''}`} onClick={() => scrollTo(s.id)}>
              {s.label}
            </button>
          ))}
        </nav>

        <div>
          <div id="appearance" className="settings-section">
            <Card title="Appearance" subtitle="Choose how VoxForge looks on this device">
              <div className="settings-row">
                <div>
                  <div className="settings-row-label">Theme</div>
                  <div className="settings-row-desc">Switch between light and dark mode</div>
                </div>
                <div className="theme-options">
                  <button className={`theme-option ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
                    <IconSun width={14} height={14} /> Light
                  </button>
                  <button className={`theme-option ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
                    <IconMoon width={14} height={14} /> Dark
                  </button>
                </div>
              </div>
            </Card>
          </div>

          <div id="language-voice" className="settings-section">
            <Card title="Language & voice" subtitle="Defaults used for new conversations">
              <div className="settings-row">
                <div>
                  <div className="settings-row-label">Assistant language</div>
                  <div className="settings-row-desc">Used for speech recognition and responses</div>
                </div>
                <div className="settings-row-control">
                  <Select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ minWidth: 180 }}>
                    {languageOptions.map((l) => <option key={l} value={l}>{l}</option>)}
                  </Select>
                </div>
              </div>
              <div className="settings-row">
                <div>
                  <div className="settings-row-label">Assistant voice</div>
                  <div className="settings-row-desc">The synthesized voice used for spoken replies</div>
                </div>
                <div className="settings-row-control">
                  <Select value={voice} onChange={(e) => setVoice(e.target.value)} style={{ minWidth: 200 }}>
                    {voiceOptions.map((v) => <option key={v.id} value={v.id}>{v.name} — {v.style}</option>)}
                  </Select>
                </div>
              </div>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button size="sm" onClick={() => save('Language and voice preferences saved.')}>Save changes</Button>
              </div>
            </Card>
          </div>

          <div id="notifications" className="settings-section">
            <Card title="Notifications" subtitle="Choose what VoxForge should notify you about">
              <div className="settings-row">
                <div>
                  <div className="settings-row-label">Email notifications</div>
                  <div className="settings-row-desc">Get notified about escalations and account activity</div>
                </div>
                <Switch checked={notifs.email} onChange={(v) => setNotifs((n) => ({ ...n, email: v }))} />
              </div>
              <div className="settings-row">
                <div>
                  <div className="settings-row-label">SMS alerts</div>
                  <div className="settings-row-desc">Critical incidents sent directly to your phone</div>
                </div>
                <Switch checked={notifs.sms} onChange={(v) => setNotifs((n) => ({ ...n, sms: v }))} />
              </div>
              <div className="settings-row">
                <div>
                  <div className="settings-row-label">Weekly summary</div>
                  <div className="settings-row-desc">A digest of usage and performance every Monday</div>
                </div>
                <Switch checked={notifs.weekly} onChange={(v) => setNotifs((n) => ({ ...n, weekly: v }))} />
              </div>
              <div className="settings-row">
                <div>
                  <div className="settings-row-label">Service incidents</div>
                  <div className="settings-row-desc">Notify me about platform-wide outages or degraded performance</div>
                </div>
                <Switch checked={notifs.incidents} onChange={(v) => setNotifs((n) => ({ ...n, incidents: v }))} />
              </div>
            </Card>
          </div>

          <div id="account" className="settings-section">
            <Card title="Account" subtitle="Your workspace identity">
              <Field label="Full name" htmlFor="acc-name">
                <Input id="acc-name" defaultValue={user?.name} />
              </Field>
              <div style={{ height: 14 }} />
              <Field label="Work email" htmlFor="acc-email">
                <Input id="acc-email" type="email" defaultValue={user?.email} />
              </Field>
              <div style={{ height: 14 }} />
              <Field label="Organization" htmlFor="acc-org">
                <Input id="acc-org" defaultValue={user?.org} disabled />
              </Field>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {savedMsg && <span style={{ fontSize: 12.5, color: 'var(--success)' }}>{savedMsg}</span>}
                <div style={{ marginLeft: 'auto' }}>
                  <Button size="sm" onClick={() => save('Account details saved.')}>Save changes</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
