import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isAuth = !!localStorage.getItem('access_token');
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{ background: 'rgba(28,28,30,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(244,242,238,0.06)' }}>
            <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 no-underline group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
                        style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                        FF
                    </div>
                    <span className="font-extrabold text-lg tracking-tight" style={{ color: '#3B9FD4' }}>
                        FleetFlow
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {!isAuth && (
                        <>
                            <a href="#features"
                                className="text-sm font-medium no-underline transition-colors duration-200 hover:!text-white"
                                style={{ color: 'rgba(244,242,238,0.6)' }}>
                                Features
                            </a>
                            <a href="#about"
                                className="text-sm font-medium no-underline transition-colors duration-200 hover:!text-white"
                                style={{ color: 'rgba(244,242,238,0.6)' }}>
                                About
                            </a>
                        </>
                    )}
                    {isAuth && (
                        <>
                            <Link to="/dashboard"
                                className="text-sm font-medium no-underline transition-colors duration-200"
                                style={{ color: isActive('/dashboard') ? '#3B9FD4' : 'rgba(244,242,238,0.6)' }}>
                                Dashboard
                            </Link>
                            <Link to="/profile"
                                className="text-sm font-medium no-underline transition-colors duration-200"
                                style={{ color: isActive('/profile') ? '#3B9FD4' : 'rgba(244,242,238,0.6)' }}>
                                {user?.full_name?.split(' ')[0] || 'Profile'}
                            </Link>
                        </>
                    )}
                </div>

                {/* Auth buttons */}
                <div className="hidden md:flex items-center gap-3">
                    {isAuth ? (
                        <button onClick={handleLogout}
                            className="px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-all duration-200 hover:scale-105"
                            style={{ background: 'transparent', border: '1.5px solid rgba(212,80,10,0.5)', color: '#D4500A' }}>
                            Sign Out
                        </button>
                    ) : (
                        <>
                            <Link to="/login"
                                className="px-4 py-2 text-sm font-semibold rounded-lg no-underline transition-all duration-200"
                                style={{ color: '#3B9FD4', border: '1.5px solid rgba(59,159,212,0.3)', background: 'transparent' }}>
                                Log In
                            </Link>
                            <Link to="/signup"
                                className="px-5 py-2 text-sm font-semibold rounded-lg no-underline text-white transition-all duration-200 hover:scale-105"
                                style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-none p-2">
                    <span className="w-5 h-0.5 rounded transition-all" style={{ background: '#F4F2EE' }} />
                    <span className="w-5 h-0.5 rounded transition-all" style={{ background: '#F4F2EE' }} />
                    <span className="w-3.5 h-0.5 rounded transition-all" style={{ background: '#F4F2EE' }} />
                </button>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden px-6 pb-6 fade-in" style={{ background: 'rgba(28,28,30,0.98)' }}>
                    <div className="flex flex-col gap-4 pt-4">
                        {!isAuth && (
                            <>
                                <a href="#features" className="text-sm font-medium no-underline" style={{ color: 'rgba(244,242,238,0.7)' }}>Features</a>
                                <a href="#about" className="text-sm font-medium no-underline" style={{ color: 'rgba(244,242,238,0.7)' }}>About</a>
                                <Link to="/login" className="text-sm font-medium no-underline" style={{ color: '#3B9FD4' }}>Log In</Link>
                                <Link to="/signup" className="text-sm font-semibold no-underline text-white px-4 py-2.5 rounded-lg text-center"
                                    style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                                    Get Started
                                </Link>
                            </>
                        )}
                        {isAuth && (
                            <>
                                <Link to="/dashboard" className="text-sm font-medium no-underline" style={{ color: 'rgba(244,242,238,0.7)' }}>Dashboard</Link>
                                <Link to="/profile" className="text-sm font-medium no-underline" style={{ color: 'rgba(244,242,238,0.7)' }}>Profile</Link>
                                <button onClick={handleLogout} className="text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer"
                                    style={{ background: 'transparent', border: '1.5px solid rgba(212,80,10,0.5)', color: '#D4500A' }}>
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
