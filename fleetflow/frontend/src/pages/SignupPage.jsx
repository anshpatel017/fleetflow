import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ROLES = [
    { value: 'manager', label: 'Manager' },
    { value: 'dispatcher', label: 'Dispatcher' },
    { value: 'safety_officer', label: 'Safety Officer' },
    { value: 'finance', label: 'Analyst' },
];

function getPasswordStrength(password) {
    if (!password) return { level: 0, label: '', color: 'transparent' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: '#D4500A' };
    if (score <= 3) return { level: 2, label: 'Medium', color: '#E8A317' };
    return { level: 3, label: 'Strong', color: '#34C759' };
}

export default function SignupPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '', email: '', role: 'manager', password: '', confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const strength = getPasswordStrength(form.password);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validate = () => {
        const err = {};
        if (!form.fullName.trim()) err.fullName = 'Full name is required';
        if (!form.email.trim()) err.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = 'Enter a valid email';
        if (!form.password) err.password = 'Password is required';
        else if (form.password.length < 6) err.password = 'Minimum 6 characters';
        if (!form.confirmPassword) err.confirmPassword = 'Please confirm your password';
        else if (form.password !== form.confirmPassword) err.confirmPassword = 'Passwords do not match';
        return err;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const err = validate();
        if (Object.keys(err).length > 0) {
            setErrors(err);
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setToast('Account created successfully! Redirecting...');
            setTimeout(() => {
                localStorage.setItem('access_token', 'mock_jwt_token_' + Date.now());
                localStorage.setItem('user', JSON.stringify({
                    id: 1,
                    email: form.email,
                    full_name: form.fullName,
                    role: form.role,
                }));
                navigate('/dashboard');
            }, 1500);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
            style={{ background: '#1C1C1E' }}>

            {/* Background decoration */}
            <div className="route-grid" />
            <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(59,159,212,0.08), transparent)' }} />
            <div className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(212,80,10,0.06), transparent)' }} />

            {/* Toast notification */}
            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 toast-in">
                    <div className="flex items-center gap-3 px-6 py-3.5 rounded-xl shadow-2xl"
                        style={{ background: 'rgba(52,199,89,0.15)', border: '1px solid rgba(52,199,89,0.3)', backdropFilter: 'blur(12px)' }}>
                        <span className="text-lg">✅</span>
                        <span className="text-sm font-semibold" style={{ color: '#34C759' }}>{toast}</span>
                    </div>
                </div>
            )}

            {/* Signup Card */}
            <div className="relative z-10 w-full max-w-md fade-up">
                <div className="glass-card rounded-2xl p-8 md:p-10">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm"
                            style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                            FF
                        </div>
                        <span className="font-extrabold text-xl tracking-tight" style={{ color: '#3B9FD4' }}>
                            FleetFlow
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Create your account</h1>
                        <p className="text-sm" style={{ color: 'rgba(244,242,238,0.4)' }}>
                            Start managing your fleet today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>
                                Full Name
                            </label>
                            <input type="text" name="fullName" value={form.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="fleet-input"
                                style={errors.fullName ? { borderColor: '#D4500A' } : {}}
                            />
                            {errors.fullName && (
                                <p className="text-xs mt-1.5 font-medium" style={{ color: '#D4500A' }}>{errors.fullName}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>
                                Email Address
                            </label>
                            <input type="email" name="email" value={form.email}
                                onChange={handleChange}
                                placeholder="you@company.com"
                                className="fleet-input"
                                style={errors.email ? { borderColor: '#D4500A' } : {}}
                            />
                            {errors.email && (
                                <p className="text-xs mt-1.5 font-medium" style={{ color: '#D4500A' }}>{errors.email}</p>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>
                                Role
                            </label>
                            <select name="role" value={form.role} onChange={handleChange}
                                className="fleet-input cursor-pointer"
                                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23999\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}>
                                {ROLES.map(r => (
                                    <option key={r.value} value={r.value} style={{ background: '#1C1C1E', color: '#F4F2EE' }}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>
                                Password
                            </label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'}
                                    name="password" value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="fleet-input"
                                    style={errors.password ? { borderColor: '#D4500A', paddingRight: '3rem' } : { paddingRight: '3rem' }}
                                />
                                <button type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-sm"
                                    style={{ color: 'rgba(244,242,238,0.4)' }}>
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs mt-1.5 font-medium" style={{ color: '#D4500A' }}>{errors.password}</p>
                            )}

                            {/* Strength indicator */}
                            {form.password && (
                                <div className="mt-3">
                                    <div className="flex gap-1.5 mb-1.5">
                                        {[1, 2, 3].map(level => (
                                            <div key={level} className="h-1 flex-1 rounded-full transition-all duration-400"
                                                style={{
                                                    background: strength.level >= level ? strength.color : 'rgba(244,242,238,0.1)',
                                                }} />
                                        ))}
                                    </div>
                                    <span className="text-xs font-medium" style={{ color: strength.color }}>
                                        {strength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>
                                Confirm Password
                            </label>
                            <input type="password" name="confirmPassword" value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="fleet-input"
                                style={errors.confirmPassword ? { borderColor: '#D4500A' } : {}}
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs mt-1.5 font-medium" style={{ color: '#D4500A' }}>{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading}
                            className="w-full py-3.5 rounded-xl text-white font-bold text-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border-none mt-2"
                            style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)', boxShadow: '0 4px 20px rgba(212,80,10,0.25)' }}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    {/* Login link */}
                    <p className="text-center text-sm mt-8" style={{ color: 'rgba(244,242,238,0.4)' }}>
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold no-underline hover:underline"
                            style={{ color: '#3B9FD4' }}>
                            Log In
                        </Link>
                    </p>
                </div>

                {/* Bottom decoration */}
                <div className="flex justify-center mt-6 gap-1.5">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full"
                            style={{ background: i === 0 ? '#3B9FD4' : 'rgba(244,242,238,0.1)' }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
