import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function ForgotPasswordPage() {
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        try {
            await api.post('/api/auth/forgot-password/', data);
            setSuccess(true);
        } catch (err) {
            const msg = err.response?.data?.email?.[0] || err.response?.data?.detail || 'Something went wrong.';
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

                    {success ? (
                        /* ── Success ── */
                        <div className="card" style={{ padding: '40px 32px', textAlign: 'center' }}>
                            <div style={{ width: 48, height: 48, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 20px' }}>
                                ✉️
                            </div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1c1917', marginBottom: 10, letterSpacing: '-0.02em' }}>
                                Check your email
                            </h2>
                            <p style={{ color: '#78716c', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: 28 }}>
                                If an account exists for that email address, we've sent a password reset link. Check your spam folder too.
                            </p>
                            <Link to="/login" style={{ display: 'inline-block', padding: '9px 20px', background: '#1c1917', color: '#fff', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                                Back to sign in
                            </Link>
                        </div>
                    ) : (
                        /* ── Form ── */
                        <>
                            <div style={{ marginBottom: 28 }}>
                                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1c1917', marginBottom: 6, letterSpacing: '-0.025em' }}>
                                    Forgot password?
                                </h1>
                                <p style={{ color: '#78716c', fontSize: '0.875rem' }}>
                                    Enter your email and we'll send you a reset link.
                                </p>
                            </div>

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

                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? 'Sending…' : 'Send reset link'}
                                    </button>
                                </form>
                            </div>

                            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.84rem', color: '#78716c' }}>
                                Remembered it?{' '}
                                <Link to="/login" style={{ color: '#1c1917', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                                    Sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
