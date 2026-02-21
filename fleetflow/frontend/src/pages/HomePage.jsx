import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
    { icon: '🔐', title: 'JWT Authentication', desc: 'Secure access and refresh tokens. Login state persists across sessions.' },
    { icon: '⚡', title: 'React + Vite', desc: 'Instant HMR, blazing fast builds. No config headaches.' },
    { icon: '🎨', title: 'TailwindCSS', desc: 'Utility-first styling. Customize everything without fighting the framework.' },
    { icon: '🗄️', title: 'PostgreSQL + Django ORM', desc: 'Production-grade database with clean Python models.' },
    { icon: '🔌', title: 'REST API', desc: 'Five pre-built endpoints — register, login, logout, forgot password, profile.' },
    { icon: '🛡️', title: 'Protected Routes', desc: 'Unauthenticated users are redirected to login automatically.' },
];

const stack = ['Django 6', 'React 19', 'Vite 7', 'TailwindCSS 4', 'PostgreSQL', 'DRF + JWT'];

export default function HomePage() {
    const isAuth = !!localStorage.getItem('access_token');

    return (
        <div style={{ background: '#f5f5f4', minHeight: '100vh' }}>
            <Navbar />

            {/* ── Hero ── */}
            <section style={{ background: '#ffffff', borderBottom: '1px solid #e7e5e4' }}>
                <div className="fade-up" style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 72px', textAlign: 'center' }}>
                    <span style={{
                        display: 'inline-block', padding: '4px 12px', borderRadius: 99,
                        background: '#f5f5f4', border: '1px solid #e7e5e4',
                        fontSize: '0.78rem', fontWeight: 600, color: '#78716c',
                        letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 28,
                    }}>
                        Hackathon Starter Kit
                    </span>

                    <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#1c1917', marginBottom: 20 }}>
                        Stop setting up.<br />Start building.
                    </h1>

                    <p style={{ fontSize: '1.0625rem', color: '#78716c', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 36px' }}>
                        A complete auth system with Django + React. Login, signup, forgot password, and profile — all done.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                        {isAuth ? (
                            <Link to="/profile" style={{ padding: '10px 24px', background: '#1c1917', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                                View Profile →
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" style={{ padding: '10px 24px', background: '#1c1917', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                                    Get started →
                                </Link>
                                <Link to="/login" style={{ padding: '10px 24px', background: '#ffffff', color: '#44403c', border: '1.5px solid #d6d3d1', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                                    Sign in
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Tech badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                        {stack.map(tag => (
                            <span key={tag} style={{ padding: '4px 10px', background: '#f5f5f4', border: '1px solid #e7e5e4', borderRadius: 6, fontSize: '0.78rem', color: '#a8a29e', fontWeight: 500 }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1c1917', marginBottom: 8, letterSpacing: '-0.02em' }}>
                    What's included
                </h2>
                <p style={{ color: '#78716c', fontSize: '0.9rem', marginBottom: 36 }}>
                    Everything wired up so you can focus on your idea.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                    {features.map((f, i) => (
                        <div key={i} className="card" style={{ padding: '20px 24px', transition: 'box-shadow 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.09)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                            <div style={{ fontSize: '1.4rem', marginBottom: 10 }}>{f.icon}</div>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1c1917', marginBottom: 6 }}>{f.title}</h3>
                            <p style={{ fontSize: '0.84rem', color: '#78716c', lineHeight: 1.65 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
                <div style={{ background: '#1c1917', borderRadius: 12, padding: '48px 40px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: 10, letterSpacing: '-0.02em' }}>
                        Ready to hack?
                    </h3>
                    <p style={{ color: '#a8a29e', fontSize: '0.9rem', marginBottom: 28 }}>
                        Create an account and start building in under 60 seconds.
                    </p>
                    <Link to="/signup" style={{ display: 'inline-block', padding: '10px 24px', background: '#ffffff', color: '#1c1917', borderRadius: 8, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
                        Create your account →
                    </Link>
                </div>
            </section>
        </div>
    );
}
