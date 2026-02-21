import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function LoginPage() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        try {
            const res = await api.post('/api/auth/login/', data);
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.non_field_errors?.[0]
                || err.response?.data?.detail
                || 'Invalid email or password.';
            setServerError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f5f5f4', minHeight: '100vh' }}>
            <Navbar />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 57px)', padding: '32px 16px' }}>
                <div className="fade-up" style={{ width: '100%', maxWidth: 400 }}>

                    {/* Header */}
                    <div style={{ marginBottom: 28 }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1c1917', marginBottom: 6, letterSpacing: '-0.025em' }}>
                            Welcome back
                        </h1>
                        <p style={{ color: '#78716c', fontSize: '0.875rem' }}>
                            Don't have an account?{' '}
                            <Link to="/signup" style={{ color: '#1c1917', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* Card */}
                    <div className="card" style={{ padding: 28 }}>

                        {serverError && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: '0.84rem', color: '#dc2626', fontWeight: 500 }}>
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <div>
                                <label className="input-label">Email</label>
                                <input type="email" placeholder="you@example.com" className="input-field"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
                                    })} />
                                {errors.email && <p className="error-text">{errors.email.message}</p>}
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                                    <label className="input-label" style={{ margin: 0 }}>Password</label>
                                    <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#78716c', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                                        Forgot password?
                                    </Link>
                                </div>
                                <input type="password" placeholder="••••••••" className="input-field"
                                    {...register('password', { required: 'Password is required' })} />
                                {errors.password && <p className="error-text">{errors.password.message}</p>}
                            </div>

                            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 4 }}>
                                {loading ? 'Signing in…' : 'Sign in'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
