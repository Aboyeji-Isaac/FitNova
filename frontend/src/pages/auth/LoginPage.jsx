import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaGithub, FaGoogle, FaLock } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../firebase/auth';
import { setUser } from '../../store/slices/authSlice';
import { addNotification } from '../../store/slices/uiSlice';

const S = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-base, #0c0c0c)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: 'var(--bg-surface, #161616)',
    border: '0.5px solid #2a2a2a',
    borderRadius: 16,
    padding: '36px 32px',
  },
  logo: {
    textAlign: 'center',
    marginBottom: 28,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '-0.02em',
  },
  logoAccent: {
    color: '#e8622a',
  },
  heading: {
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginBottom: 28,
  },
  link: {
    color: '#e8622a',
    textDecoration: 'none',
    fontWeight: 500,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginBottom: 16,
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 500,
    color: '#888',
    marginBottom: 6,
    letterSpacing: '0.03em',
  },
  inputWrap: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#555',
    fontSize: 14,
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    background: 'var(--bg-elevated, #1a1a1a)',
    border: '0.5px solid #2a2a2a',
    borderRadius: 10,
    padding: '11px 12px 11px 36px',
    fontSize: 13,
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  inputError: {
    borderColor: 'rgba(226, 75, 74, 0.6)',
  },
  errorText: {
    fontSize: 11,
    color: '#E24B4A',
    marginTop: 5,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: '#888',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#e8622a',
    width: 14,
    height: 14,
  },
  forgotLink: {
    fontSize: 12,
    color: '#e8622a',
    textDecoration: 'none',
  },
  submitBtn: {
    width: '100%',
    background: '#e8622a',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '13px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    fontFamily: 'inherit',
    marginBottom: 24,
  },
  submitBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  dividerWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: '0.5px',
    background: '#2a2a2a',
  },
  dividerText: {
    fontSize: 11,
    color: '#555',
    whiteSpace: 'nowrap',
  },
  socialGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginBottom: 24,
  },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    background: 'var(--bg-elevated, #1a1a1a)',
    border: '0.5px solid #2a2a2a',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 13,
    color: '#888',
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
    fontFamily: 'inherit',
  },
  signupRow: {
    textAlign: 'center',
    fontSize: 13,
    color: '#555',
  },
};

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const userCredential = await loginUser(data.email, data.password);
      const user = userCredential.user;
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }));
      dispatch(addNotification({ type: 'success', message: 'Login successful!' }));
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      dispatch(addNotification({
        type: 'error',
        message: error.message || 'Failed to login. Please try again.',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      dispatch(addNotification({ type: 'info', message: 'Google login coming soon!' }));
    } catch (error) {
      dispatch(addNotification({ type: 'error', message: error.message || 'Failed to login with Google.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setLoading(true);
      dispatch(addNotification({ type: 'info', message: 'GitHub login coming soon!' }));
    } catch (error) {
      dispatch(addNotification({ type: 'error', message: error.message || 'Failed to login with GitHub.' }));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (fieldName) => ({
    ...S.input,
    ...(errors[fieldName] ? S.inputError : {}),
    ...(focusedField === fieldName ? { borderColor: 'rgba(232, 98, 42, 0.5)' } : {}),
  });

  return (
    <div style={S.page}>
      <div style={S.card}>

        {/* Logo */}
        <div style={S.logo}>
          <span style={S.logoText}>
            Fit<span style={S.logoAccent}>Nova</span>
          </span>
        </div>

        <h1 style={S.heading}>Welcome back</h1>
        <p style={S.subheading}>
          Don't have an account?{' '}
          <Link to="/auth/register" style={S.link}>Sign up</Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={S.fieldGroup}>

            {/* Email */}
            <div>
              <label htmlFor="email" style={S.label}>Email address</label>
              <div style={S.inputWrap}>
                <FaEnvelope style={S.inputIcon} />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  style={inputStyle('email')}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
              </div>
              {errors.email && <p style={S.errorText}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={S.label}>Password</label>
              <div style={S.inputWrap}>
                <FaLock style={S.inputIcon} />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  style={inputStyle('password')}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
              </div>
              {errors.password && <p style={S.errorText}>{errors.password.message}</p>}
            </div>

          </div>

          {/* Remember me + Forgot */}
          <div style={S.row}>
            <label style={S.checkboxLabel}>
              <input type="checkbox" style={S.checkbox} id="remember-me" name="remember-me" />
              Remember me
            </label>
            <Link to="/auth/forgot-password" style={S.forgotLink}>Forgot password?</Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ ...S.submitBtn, ...(loading ? S.submitBtnDisabled : {}) }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div style={S.dividerWrap}>
          <div style={S.dividerLine} />
          <span style={S.dividerText}>or continue with</span>
          <div style={S.dividerLine} />
        </div>

        {/* Social buttons */}
        <div style={S.socialGrid}>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{ ...S.socialBtn, ...(loading ? S.submitBtnDisabled : {}) }}
          >
            <FaGoogle style={{ color: '#e8622a', fontSize: 15 }} />
            Google
          </button>
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={loading}
            style={{ ...S.socialBtn, ...(loading ? S.submitBtnDisabled : {}) }}
          >
            <FaGithub style={{ color: '#aaa', fontSize: 15 }} />
            GitHub
          </button>
        </div>

        {/* Sign up link */}
        <div style={S.signupRow}>
          New to FitNova?{' '}
          <Link to="/auth/register" style={S.link}>Create an account</Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;