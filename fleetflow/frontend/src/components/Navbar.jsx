import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isAuth = !!localStorage.getItem('access_token');

    const isActive = (path) => location.pathname === path;

    const linkStyle = (path) => ({
        fontSize: '0.875rem',
        fontWeight: 500,
        color: isActive(path) ? '#1c1917' : '#78716c',
        textDecoration: 'none',
        transition: 'color 0.15s',
        paddingBottom: '2px',
        borderBottom: isActive(path) ? '1.5px solid #1c1917' : '1.5px solid transparent',
    });

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header style={{ background: '#ffffff', borderBottom: '1px solid #e7e5e4', position: 'sticky', top: 0, zIndex: 50 }}>
            <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {/* Logo */}
                <Link to="/dashboard" style={{ fontWeight: 800, fontSize: '1rem', color: '#1c1917', textDecoration: 'none', letterSpacing: '-0.02em' }}>
                    FleetFlow
                </Link>

                {/* Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                    <Link to="/" style={linkStyle('/')}>Home</Link>

                    {isAuth ? (
                        <>
                            <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
                            <Link to="/profile" style={linkStyle('/profile')}>
                                {user?.full_name?.split(' ')[0] || 'Profile'}
                            </Link>
                            <button onClick={handleLogout} style={{
                                padding: '6px 14px',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                background: 'transparent',
                                border: '1.5px solid #e7e5e4',
                                borderRadius: 7,
                                color: '#78716c',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                fontFamily: 'inherit',
                            }}
                                onMouseEnter={e => { e.target.style.borderColor = '#dc2626'; e.target.style.color = '#dc2626'; }}
                                onMouseLeave={e => { e.target.style.borderColor = '#e7e5e4'; e.target.style.color = '#78716c'; }}
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={linkStyle('/login')}>Login</Link>
                            <Link to="/signup" style={{
                                padding: '6px 14px',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                background: '#1c1917',
                                color: '#ffffff',
                                borderRadius: 7,
                                textDecoration: 'none',
                                transition: 'background 0.15s',
                            }}>
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
