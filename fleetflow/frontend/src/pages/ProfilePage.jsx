import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function ProfilePage() {
    const navigate = useNavigate();
    const fileInputRef = useRef();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/api/auth/profile/');
            setProfile(res.data);
            reset({ full_name: res.data.full_name, phone: res.data.phone || '' });
        } catch {
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
    };

    const onSubmit = async (data) => {
        setSaving(true);
        setServerError('');
        setSuccessMsg('');
        try {
            const formData = new FormData();
            formData.append('full_name', data.full_name);
            formData.append('phone', data.phone || '');
            if (avatarFile) formData.append('profile_image', avatarFile);

            const res = await api.put('/api/auth/profile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfile(res.data);
            localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user') || '{}'), ...res.data }));
            setSuccessMsg('Profile updated.');
            setEditMode(false);
            setAvatarFile(null);
        } catch (err) {
            setServerError(err.response?.data?.detail || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const avatarSrc = avatarPreview || (profile?.profile_image ? `${API_BASE}${profile.profile_image}` : null);
    const initials = (profile?.full_name?.[0] || profile?.email?.[0] || '?').toUpperCase();

    if (loading) {
        return (
            <div style={{ background: '#f5f5f4', minHeight: '100vh' }}>
                <Navbar />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 57px)' }}>
                    <p style={{ color: '#a8a29e', fontSize: '0.875rem' }}>Loading…</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#f5f5f4', minHeight: '100vh' }}>
            <Navbar />

            <div style={{ maxWidth: 620, margin: '0 auto', padding: '48px 24px 80px' }}>
                <div className="fade-up">

                    {/* Page header */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.025em' }}>
                                Profile
                            </h1>
                            <p style={{ color: '#a8a29e', fontSize: '0.84rem', marginTop: 4 }}>{profile?.email}</p>
                        </div>
                        {!editMode && (
                            <button
                                onClick={() => { setEditMode(true); setSuccessMsg(''); }}
                                style={{ padding: '7px 16px', fontSize: '0.8125rem', fontWeight: 600, background: '#fff', border: '1.5px solid #d6d3d1', borderRadius: 8, color: '#44403c', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#a8a29e'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = '#d6d3d1'}
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    {/* Success */}
                    {successMsg && (
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: '0.84rem', color: '#15803d', fontWeight: 500 }}>
                            {successMsg}
                        </div>
                    )}
                    {serverError && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: '0.84rem', color: '#dc2626', fontWeight: 500 }}>
                            {serverError}
                        </div>
                    )}

                    {/* Main card */}
                    <div className="card" style={{ overflow: 'hidden' }}>

                        {/* Avatar section */}
                        <div style={{ padding: '32px 28px 24px', borderBottom: '1px solid #e7e5e4', display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#1c1917', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid #e7e5e4' }}>
                                    {avatarSrc
                                        ? <img src={avatarSrc} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>{initials}</span>
                                    }
                                </div>
                                {editMode && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ position: 'absolute', bottom: -2, right: -2, width: 26, height: 26, borderRadius: '50%', background: '#ffffff', border: '1.5px solid #d6d3d1', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Change photo">
                                        ✏️
                                    </button>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleAvatarChange} />

                            <div>
                                <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1c1917' }}>{profile?.full_name || '—'}</p>
                                <p style={{ color: '#78716c', fontSize: '0.84rem', marginTop: 2 }}>{profile?.email}</p>
                            </div>
                        </div>

                        {/* Fields */}
                        <div style={{ padding: '24px 28px' }}>
                            {editMode ? (
                                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div>
                                        <label className="input-label">Full Name</label>
                                        <input type="text" className="input-field"
                                            {...register('full_name', { required: 'Full name is required' })} />
                                        {errors.full_name && <p className="error-text">{errors.full_name.message}</p>}
                                    </div>
                                    <div>
                                        <label className="input-label">Phone</label>
                                        <input type="tel" placeholder="+91 98765 43210" className="input-field"
                                            {...register('phone')} />
                                    </div>

                                    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                        <button type="submit" disabled={saving}
                                            style={{ flex: 1, padding: '9px', background: '#1c1917', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}>
                                            {saving ? 'Saving…' : 'Save changes'}
                                        </button>
                                        <button type="button"
                                            onClick={() => { setEditMode(false); setAvatarPreview(null); setAvatarFile(null); reset(); }}
                                            style={{ flex: 1, padding: '9px', background: '#fff', color: '#44403c', border: '1.5px solid #d6d3d1', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    {[
                                        { label: 'Full Name', value: profile?.full_name || '—' },
                                        { label: 'Email', value: profile?.email },
                                        { label: 'Phone', value: profile?.phone || '—' },
                                        { label: 'Role', value: profile?.role ? profile.role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—' },
                                    ].map(({ label, value }, i, arr) => (
                                        <div key={label} style={{
                                            display: 'flex', justifyContent: 'space-between', padding: '14px 0',
                                            borderBottom: i < arr.length - 1 ? '1px solid #f5f5f4' : 'none',
                                        }}>
                                            <span style={{ fontSize: '0.84rem', color: '#a8a29e', fontWeight: 500 }}>{label}</span>
                                            <span style={{ fontSize: '0.875rem', color: '#1c1917', fontWeight: 500 }}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
