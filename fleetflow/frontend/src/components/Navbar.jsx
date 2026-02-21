import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isAuth = !!localStorage.getItem('access_token');

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const linkClass = (path) =>
        `text-sm font-semibold transition-colors border-b-2 pb-0.5 ${isActive(path)
            ? 'text-slate-900 border-slate-900'
            : 'text-slate-500 border-transparent hover:text-slate-900'
        }`;

    return (

        <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                <Link to="/dashboard" className="flex items-center gap-2 font-black text-slate-900 tracking-tight">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs shadow-sm shadow-blue-200">FF</span>
                    <span>FleetFlow</span>
                </Link>

                <div className="flex items-center gap-5">
                    <Link to="/" className={linkClass('/')}>Home</Link>

                    {isAuth ? (
                        <>
                            <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
                            <Link to="/profile" className={linkClass('/profile')}>
                                {user?.full_name?.split(' ')[0] || 'Profile'}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-semibold text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 px-3 py-1.5 rounded-xl transition-colors"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={linkClass('/login')}>Login</Link>
                            <Link to="/signup" className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl transition-colors shadow-sm shadow-blue-200">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
