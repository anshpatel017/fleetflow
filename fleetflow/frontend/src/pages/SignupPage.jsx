import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function SignupPage() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch('password');

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        try {
            const res = await api.post('/api/auth/register/', {
                email: data.email,
                full_name: data.full_name,
                phone: data.phone || '',
                role: data.role,
                password: data.password,
                password2: data.password2,
            });
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            const d = err.response?.data;
            setServerError(d?.email?.[0] || d?.password?.[0] || d?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f5f5f4', minHeight: '100vh' }}>
            <Navbar />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 57px)', padding: '32px 16px' }}>
                <div className="fade-up" style={{ width: '100%', maxWidth: 420 }}>

                    {/* Header */}
                    <div style={{ marginBottom: 28 }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1c1917', marginBottom: 6, letterSpacing: '-0.025em' }}>
                            Create an account
                        </h1>
                        <p style={{ color: '#78716c', fontSize: '0.875rem' }}>
                            Already have one?{' '}
                            <Link to="/login" style={{ color: '#1c1917', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                                Sign in
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

                        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label className="input-label">Full Name</label>
                                <input type="text" placeholder="John Doe" className="input-field"
                                    {...register('full_name', { required: 'Full name is required' })} />
                                {errors.full_name && <p className="error-text">{errors.full_name.message}</p>}
                            </div>

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
                                <label className="input-label">Phone{' '}<span style={{ fontWeight: 400, color: '#a8a29e' }}>(optional)</span></label>
                                <input type="tel" placeholder="+91 98765 43210" className="input-field"
                                    {...register('phone')} />
                            </div>

                            <div>
                                <label className="input-label">Role</label>
                                <select className="input-field" style={{ cursor: 'pointer' }}
                                    {...register('role', { required: 'Please select a role' })}>
                                    <option value="">Select your role…</option>
                                    <option value="manager">Fleet Manager</option>
                                    <option value="dispatcher">Dispatcher</option>
                                    <option value="safety_officer">Safety Officer</option>
                                    <option value="analyst">Financial Analyst</option>
                                </select>
                                {errors.role && <p className="error-text">{errors.role.message}</p>}
                            </div>

                            <div>
                                <label className="input-label">Password</label>
                                <input type="password" placeholder="Minimum 8 characters" className="input-field"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 8, message: 'At least 8 characters' }
                                    })} />
                                {errors.password && <p className="error-text">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="input-label">Confirm Password</label>
                                <input type="password" placeholder="Repeat your password" className="input-field"
                                    {...register('password2', {
                                        required: 'Please confirm your password',
                                        validate: v => v === password || 'Passwords do not match'
                                    })} />
                                {errors.password2 && <p className="error-text">{errors.password2.message}</p>}
                            </div>

                            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 6 }}>
                                {loading ? 'Creating account…' : 'Create account'}
                            </button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#a8a29e', marginTop: 20 }}>
                        By signing up, you agree to our{' '}
                        <span style={{ color: '#78716c', fontWeight: 500 }}>Terms of Service</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
