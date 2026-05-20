import { useState } from 'react';
import { FiAlertCircle, FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    maxWidth: 420,
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
  errorBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    background: 'rgba(226, 75, 74, 0.08)',
    border: '0.5px solid rgba(226, 75, 74, 0.3)',
    borderRadius: 10,
    padding: '12px 14px',
    marginBottom: 20,
  },
  errorBannerIcon: {
    color: '#E24B4A',
    flexShrink: 0,
    marginTop: 1,
  },
  errorBannerText: {
    fontSize: 13,
    color: '#E24B4A',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginBottom: 20,
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
  inputIconRight: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#555',
    fontSize: 14,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
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
  inputWithToggle: {
    paddingRight: 36,
  },
  inputError: {
    borderColor: 'rgba(226, 75, 74, 0.6)',
  },
  inputFocused: {
    borderColor: 'rgba(232, 98, 42, 0.5)',
  },
  errorText: {
    fontSize: 11,
    color: '#E24B4A',
    marginTop: 5,
  },
  successRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    color: '#3b6d11',
    fontSize: 12,
  },
  strengthBars: {
    display: 'flex',
    gap: 4,
    marginTop: 8,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    background: '#2a2a2a',
    transition: 'background 0.3s',
  },
  strengthLabel: {
    fontSize: 11,
    marginTop: 5,
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
    marginBottom: 20,
  },
  submitBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  signinRow: {
    textAlign: 'center',
    fontSize: 13,
    color: '#555',
  },
};

const STRENGTH_COLORS = ['#E24B4A', '#E24B4A', '#e8622a', '#639922', '#3b6d11'];
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState(null);

  const validatePassword = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.displayName) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[a-z]/.test(formData.password) || !/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') setPasswordStrength(validatePassword(value));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const result = await signup({
      displayName: formData.displayName,
      email: formData.email,
      password: formData.password,
    });
    if (result.success) {
      navigate('/onboarding');
    } else {
      setApiError(result.error || 'Signup failed');
    }
  };

  const inputStyle = (fieldName, withToggle = false) => ({
    ...S.input,
    ...(withToggle ? S.inputWithToggle : {}),
    ...(errors[fieldName] ? S.inputError : {}),
    ...(focusedField === fieldName ? S.inputFocused : {}),
  });

  const strengthColor = STRENGTH_COLORS[passwordStrength] || '#2a2a2a';

  return (
    <div style={S.page}>
      <div style={S.card}>

        {/* Logo */}
        <div style={S.logo}>
          <span style={S.logoText}>
            Fit<span style={S.logoAccent}>Nova</span>
          </span>
        </div>

        <h1 style={S.heading}>Create your account</h1>
        <p style={S.subheading}>Start your fitness journey today</p>

        {/* Error banner */}
        {(apiError || authError) && (
          <div style={S.errorBanner}>
            <FiAlertCircle style={S.errorBannerIcon} size={15} />
            <p style={S.errorBannerText}>{apiError || authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={S.fieldGroup}>

            {/* Display name */}
            <div>
              <label htmlFor="displayName" style={S.label}>Display name</label>
              <div style={S.inputWrap}>
                <FiUser style={S.inputIcon} />
                <input
                  id="displayName"
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  style={inputStyle('displayName')}
                  onFocus={() => setFocusedField('displayName')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              {errors.displayName && <p style={S.errorText}>{errors.displayName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" style={S.label}>Email address</label>
              <div style={S.inputWrap}>
                <FiMail style={S.inputIcon} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={inputStyle('email')}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              {errors.email && <p style={S.errorText}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={S.label}>Password</label>
              <div style={S.inputWrap}>
                <FiLock style={S.inputIcon} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter a strong password"
                  style={inputStyle('password', true)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={S.inputIconRight}
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>

              {/* Strength meter */}
              {formData.password && (
                <>
                  <div style={S.strengthBars}>
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          ...S.strengthBar,
                          background: i < passwordStrength ? strengthColor : '#2a2a2a',
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ ...S.strengthLabel, color: strengthColor }}>
                    {STRENGTH_LABELS[passwordStrength]}
                  </p>
                </>
              )}
              {errors.password && <p style={S.errorText}>{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" style={S.label}>Confirm password</label>
              <div style={S.inputWrap}>
                <FiLock style={S.inputIcon} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={inputStyle('confirmPassword', true)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={S.inputIconRight}
                >
                  {showConfirmPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div style={S.successRow}>
                  <FiCheck size={13} />
                  <span>Passwords match</span>
                </div>
              )}
              {errors.confirmPassword && <p style={S.errorText}>{errors.confirmPassword}</p>}
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ ...S.submitBtn, ...(loading ? S.submitBtnDisabled : {}) }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Sign in link */}
        <div style={S.signinRow}>
          Already have an account?{' '}
          <Link to="/login" style={S.link}>Sign in</Link>
        </div>

      </div>
    </div>
  );
}