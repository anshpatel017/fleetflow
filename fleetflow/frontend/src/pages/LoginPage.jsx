import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
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

    const canSubmit = useMemo(() => email.trim().length > 0 && password.trim().length > 0, [email, password]);

    const onSubmit = async (e) => {
        e.preventDefault();
        const next = {};
        if (!email.trim()) next.email = 'Email is required';
        if (!password.trim()) next.password = 'Password is required';
        if (email && !/\S+@\S+\.\S+/.test(email)) next.email = 'Enter a valid email address';
        setErrors(next);
        if (Object.keys(next).length) return;

        setLoading(true);
        await new Promise(r => setTimeout(r, 650));
        localStorage.setItem('ff_authed', 'true');
        setLoading(false);
        navigate('/dashboard');
    };

    return (
        <div
            className="min-h-screen grid place-items-center px-4"
            style={{
                background: 'radial-gradient(900px 500px at 50% 20%, rgba(99,102,241,0.18), transparent 60%), var(--ff-bg)',
            }}
        >
            <div className="w-full max-w-[420px]">
                <div className="ff-card p-6 md:p-7" style={{ borderRadius: 16 }}>
                    <div className="text-center">
                        <div className="text-[26px] font-extrabold tracking-tight">
                            <span className="text-white">Fleet</span>
                            <span style={{ color: 'var(--ff-primary)' }}>Flow</span>
                        </div>
                        <div className="mt-2 text-[13px] text-slate-400">Fleet Intelligence. Simplified.</div>
                    </div>

                    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                        <FormInput
                            label="Email"
                            placeholder="you@fleetflow.io"
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
                                    className="ff-btn ff-btn-ghost w-9 h-9"
                                    onClick={() => setShow(v => !v)}
                                    aria-label={show ? 'Hide password' : 'Show password'}
                                >
                                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            }
                        />

                        <FormSelect
                            label="Role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="manager">Manager</option>
                            <option value="dispatcher">Dispatcher</option>
                            <option value="safety_officer">Safety Officer</option>
                            <option value="analyst">Analyst</option>
                        </FormSelect>

                        <button
                            className="ff-btn ff-btn-primary w-full h-[46px]"
                            type="submit"
                            disabled={!canSubmit || loading}
                            style={{ opacity: !canSubmit || loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Signing In…' : 'Sign In'}
                        </button>

                        <div className="flex justify-end">
                            <Link to="#" className="text-[12px] font-semibold text-slate-400 hover:text-slate-200 underline underline-offset-4">
                                Forgot Password?
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="text-center text-[12px] text-slate-500 mt-4">
                    UI-only prototype (mock auth). Use role switcher to preview RBAC.
                </div>
            </div>
        </div>
    );
}
