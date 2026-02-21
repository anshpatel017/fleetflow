import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ROLES = [
    { value: 'manager', label: 'Manager' },
    { value: 'dispatcher', label: 'Dispatcher' },
    { value: 'safety_officer', label: 'Safety Officer' },
    { value: 'finance', label: 'Analyst' },
];

export default function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '', role: 'manager' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validate = () => {
        const err = {};
        if (!form.email.trim()) err.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = 'Enter a valid email';
        if (!form.password.trim()) err.password = 'Password is required';
        else if (form.password.length < 6) err.password = 'Minimum 6 characters';
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
        // Mock auth
        setTimeout(() => {
            localStorage.setItem('access_token', 'mock_jwt_token_' + Date.now());
            localStorage.setItem('user', JSON.stringify({
                id: 1,
                email: form.email,
                full_name: form.email.split('@')[0],
                role: form.role,
            }));
            setLoading(false);
            navigate('/dashboard');
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
            style={{ background: '#1C1C1E' }}>

            {/* Background decoration */}
            <div className="route-grid" />
            <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(59,159,212,0.08), transparent)' }} />
            <div className="absolute bottom-1/4 left-1/3 w-60 h-60 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(212,80,10,0.06), transparent)' }} />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md fade-up">
                <div className="glass-card rounded-2xl p-8 md:p-10">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-8">
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
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Welcome back</h1>
                        <p className="text-sm" style={{ color: 'rgba(244,242,238,0.4)' }}>
                            Sign in to manage your fleet
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                            <div className="flex justify-end mt-2">
                                <Link to="/forgot-password"
                                    className="text-xs font-medium no-underline transition-colors hover:underline"
                                    style={{ color: '#3B9FD4' }}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {/* Role selector */}
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>
                                Demo Role
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

                        {/* Submit */}
                        <button type="submit" disabled={loading}
                            className="w-full py-3.5 rounded-xl text-white font-bold text-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border-none"
                            style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)', boxShadow: '0 4px 20px rgba(212,80,10,0.25)' }}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : 'Log In'}
                        </button>
                    </form>

                    {/* Sign up link */}
                    <p className="text-center text-sm mt-8" style={{ color: 'rgba(244,242,238,0.4)' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold no-underline hover:underline"
                            style={{ color: '#3B9FD4' }}>
                            Sign Up
                        </Link>
                    </p>
                </div>

                {/* Bottom decoration */}
                <div className="flex justify-center mt-6 gap-1.5">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full"
                            style={{ background: i === 0 ? '#D4500A' : 'rgba(244,242,238,0.1)' }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
