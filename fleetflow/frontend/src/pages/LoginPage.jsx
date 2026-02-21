import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Truck } from 'lucide-react';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import useRoleStore from '../store/roleStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const { role, setRole } = useRoleStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [rememberMe, setRememberMe] = useState(false);

    const canSubmit = useMemo(() => email.trim().length > 0 && password.trim().length > 0, [email, password]);

    const onSubmit = async (e) => {
        e.preventDefault();
        const next = {};
        if (!email.trim()) next.email = 'Email address is required.';
        if (!password.trim()) next.password = 'Password is required.';
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            next.email = 'Please enter a valid email address.';
        }
        
        setErrors(next);
        if (Object.keys(next).length) return;

        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        localStorage.setItem('ff_authed', 'true');
        setLoading(false);
        navigate('/dashboard');
    };

    return (
        <div className="ff-grid-bg" style={{
            minHeight: '100vh', display: 'grid', placeItems: 'center',
            padding: '24px 16px', background: 'var(--bg)',
        }}>
            <div className="page-enter" style={{ width: '100%', maxWidth: 420 }}>
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 48, height: 48, borderRadius: 14,
                        background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                        marginBottom: 16,
                    }}>
                        <Truck size={24} color="#fff" />
                    </div>
                    <h1 style={{
                        fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 26,
                        color: 'var(--text)', letterSpacing: '-0.02em', margin: 0,
                    }}>
                        Sign in to FleetFlow
                    </h1>
                    <p style={{
                        fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-muted)',
                        marginTop: 8,
                    }}>
                        Welcome back! Please enter your details.
                    </p>
                </div>

                {/* Card */}
                <div className="ff-card" style={{ padding: '32px', borderRadius: 16 }}>
                    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <FormInput
                            label="Email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                            type="email"
                            autoComplete="email"
                        />

                        <FormInput
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                            type={show ? 'text' : 'password'}
                            autoComplete="current-password"
                            rightAdornment={
                                <button
                                    type="button"
                                    onClick={() => setShow(v => !v)}
                                    tabIndex="-1"
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'var(--text-faint)', padding: 4, display: 'flex',
                                    }}
                                >
                                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                        />

                        {/* Remember + Forgot */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    style={{ accentColor: '#6366F1' }}
                                />
                                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--text-muted)' }}>
                                    Remember for 30 days
                                </span>
                            </label>
                            <Link to="#" style={{
                                fontFamily: 'var(--font-body)', fontWeight: 600,
                                color: '#818CF8', textDecoration: 'none', fontSize: 13,
                            }}>
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            className="ff-btn ff-btn-primary"
                            type="submit"
                            disabled={!canSubmit || loading}
                            style={{
                                width: '100%', height: 44, fontSize: 14, fontWeight: 700,
                                opacity: (!canSubmit || loading) ? 0.55 : 1,
                            }}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>

                        {/* Role Switcher */}
                        <div style={{ paddingTop: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 12px' }}>
                                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                                <span style={{
                                    fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
                                    textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-faint)',
                                }}>
                                    Prototype Settings
                                </span>
                                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                            </div>
                            <FormSelect
                                label="Preview Role as"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="manager">Manager</option>
                                <option value="dispatcher">Dispatcher</option>
                                <option value="safety_officer">Safety Officer</option>
                                <option value="analyst">Analyst</option>
                            </FormSelect>
                        </div>
                    </form>
                </div>
                
                {/* Footer */}
                <p style={{
                    textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11,
                    color: 'var(--text-faint)', marginTop: 24,
                }}>
                    © 2024 FleetFlow Technologies. All rights reserved.
                </p>
            </div>
        </div>
    );
}