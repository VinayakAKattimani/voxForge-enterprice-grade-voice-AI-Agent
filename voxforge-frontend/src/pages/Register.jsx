import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Field, Input } from '../components/ui/Field';
import Button from '../components/ui/Button';
import Waveform from '../components/voice/Waveform';
import { IconMail, IconLock, IconProfile, IconBuilding } from '../components/ui/icons';
import './auth.css';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', org: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-brand">
            <span className="auth-brand-mark">V</span>
            <span className="auth-brand-name">VoxForge</span>
          </div>

          <h1 className="auth-heading">Create your workspace</h1>
          <p className="auth-subheading">Set up VoxForge for your team in a couple of minutes.</p>

          {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-row">
              <Field label="Full name" htmlFor="name">
                <Input id="name" icon={<IconProfile width={15} height={15} />} placeholder="Ananya Rao" value={form.name} onChange={update('name')} required />
              </Field>
            </div>
            <Field label="Company" htmlFor="org">
              <Input id="org" icon={<IconBuilding width={15} height={15} />} placeholder="Northfield Bank" value={form.org} onChange={update('org')} required />
            </Field>
            <Field label="Work email" htmlFor="email">
              <Input id="email" type="email" icon={<IconMail width={15} height={15} />} placeholder="you@company.com" value={form.email} onChange={update('email')} required />
            </Field>
            <Field label="Password" htmlFor="password" hint="Use at least 8 characters.">
              <Input id="password" type="password" icon={<IconLock width={15} height={15} />} placeholder="Create a password" value={form.password} onChange={update('password')} required />
            </Field>

            <Button type="submit" fullWidth loading={loading}>Create account</Button>
          </form>

          <p className="auth-alt-action">
            Already have a workspace? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="auth-visual">
        <div className="auth-visual-top">
          <span className="auth-brand-mark">V</span> VoxForge
        </div>
        <div>
          <p className="auth-visual-quote">
            Deploy a voice assistant that knows your <span>policies, products, and people</span> — not a generic script.
          </p>
          <div className="auth-visual-waveform">
            <Waveform active tone="neutral" />
          </div>
        </div>
        <div className="auth-visual-foot">
          <span>Set up in minutes</span>
          <span>No credit card required</span>
        </div>
      </div>
    </div>
  );
}
