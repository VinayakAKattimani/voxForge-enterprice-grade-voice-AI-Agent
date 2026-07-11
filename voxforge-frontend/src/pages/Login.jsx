import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Field, Input, Switch } from '../components/ui/Field';
import Button from '../components/ui/Button';
import Waveform from '../components/voice/Waveform';
import { IconMail, IconLock } from '../components/ui/icons';
import './auth.css';

export default function Login() {
  const { login, loading, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('ananya.rao@northfieldbank.com');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
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

          <h1 className="auth-heading">Welcome back</h1>
          <p className="auth-subheading">Sign in to manage your voice assistants and conversations.</p>

          {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <Field label="Work email" htmlFor="email">
              <Input id="email" type="email" icon={<IconMail width={15} height={15} />} placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
            <Field label="Password" htmlFor="password">
              <Input id="password" type="password" icon={<IconLock width={15} height={15} />} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>

            <div className="auth-checkbox-row">
              <label><Switch checked={remember} onChange={setRemember} /> Keep me signed in</label>
              <a href="#forgot" className="auth-link" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>

            <Button type="submit" fullWidth loading={loading}>Sign in</Button>
            <Button type="button" variant="secondary" fullWidth onClick={() => { loginAsDemo(); navigate('/dashboard'); }}>
              Continue with demo workspace
            </Button>
          </form>

          <p className="auth-alt-action">
            Don&apos;t have a workspace yet? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>

      <div className="auth-visual">
        <div className="auth-visual-top">
          <span className="auth-brand-mark">V</span> VoxForge
        </div>
        <div>
          <p className="auth-visual-quote">
            &ldquo;Every call answered in <span>under a second</span>, on knowledge your team actually trusts.&rdquo;
          </p>
          <div className="auth-visual-waveform">
            <Waveform active speaking tone="neutral" />
          </div>
        </div>
        <div className="auth-visual-foot">
          <span>Trusted by support, HR, and banking teams</span>
          <span>SOC 2 · GDPR ready</span>
        </div>
      </div>
    </div>
  );
}
