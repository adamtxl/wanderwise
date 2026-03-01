import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './LandingPage.css';

function LandingPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('login'); // 'register' | 'login'
  const [loaded, setLoaded] = useState(false);

  const errors = useSelector((store) => store.errors);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/trips';

  useEffect(() => {
    setTimeout(() => setLoaded(true), 50);
  }, []);

  // Redirect after successful login
  useEffect(() => {
    if (user.id) {
      navigate(from);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (errors.registrationMessage === 'Registration successful!') {
      navigate(from);
    } else if (errors.registrationMessage === 'Username already exists. Please choose another one.') {
      alert('Username already exists. Please choose another one.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [errors.registrationMessage, navigate]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (username && password && email) {
      dispatch({ type: 'REGISTER', payload: { username, password, email } });
    } else {
      dispatch({ type: 'REGISTRATION_INPUT_ERROR' });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch({ type: 'LOGIN', payload: { username, password } });
  };

  const features = [
    { icon: '✦', label: 'Trip Itineraries', desc: 'Day-by-day planning with interactive maps' },
    { icon: '◈', label: 'Smart Packing Lists', desc: 'Reusable items saved across every trip' },
    { icon: '⬡', label: 'Collaborate', desc: 'Plan together with travel companions' },
    { icon: '◉', label: 'Map Your Journey', desc: 'Pin every destination and port of call' },
  ];

  return (
    <div className={`ww-landing ${loaded ? 'ww-loaded' : ''}`}>
      {/* Left panel — hero */}
      <div className="ww-hero">
        <div className="ww-hero-overlay" />
        <div className="ww-hero-content">
          <div className="ww-eyebrow">Travel Planning, Reimagined</div>
          <h1 className="ww-headline">
            Every great<br />journey starts<br />
            <span className="ww-headline-accent">with a plan.</span>
          </h1>
          <p className="ww-subhead">
            From Caribbean cruises to mountain road trips —<br />
            WanderWise keeps your adventures organized.
          </p>
          <div className="ww-features">
            {features.map((f, i) => (
              <div className="ww-feature" key={i} style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                <span className="ww-feature-icon">{f.icon}</span>
                <div>
                  <div className="ww-feature-label">{f.label}</div>
                  <div className="ww-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — auth */}
      <div className="ww-auth-panel">
        <div className="ww-auth-inner">
          <div className="ww-brand">
            <span className="ww-brand-mark">✦</span>
            WanderWise
          </div>

          <div className="ww-tabs">
            <button
              className={`ww-tab ${mode === 'register' ? 'ww-tab-active' : ''}`}
              onClick={() => setMode('register')}
            >
              Create Account
            </button>
            <button
              className={`ww-tab ${mode === 'login' ? 'ww-tab-active' : ''}`}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
          </div>

          <div className="ww-tab-indicator-wrap">
            <div className={`ww-tab-indicator ${mode === 'login' ? 'ww-tab-indicator-right' : ''}`} />
          </div>

          {mode === 'register' ? (
            <form className="ww-form" onSubmit={handleRegister}>
              <p className="ww-form-tagline">Start planning your next adventure.</p>
              {errors.registrationMessage && (
                <div className="ww-error">{errors.registrationMessage}</div>
              )}
              <div className="ww-field">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="ww-field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="ww-field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />
              </div>
              <button type="submit" className="ww-btn-primary">
                Begin Your Journey →
              </button>
            </form>
          ) : (
            <form className="ww-form" onSubmit={handleLogin}>
              <p className="ww-form-tagline">Welcome back, traveler.</p>
              {errors.loginMessage && (
                <div className="ww-error">{errors.loginMessage}</div>
              )}
              <div className="ww-field">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="ww-field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <button type="submit" className="ww-btn-primary">
                Sign In →
              </button>
            </form>
          )}

          <div className="ww-auth-footer">
            Trusted by travelers planning their next great escape.
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
