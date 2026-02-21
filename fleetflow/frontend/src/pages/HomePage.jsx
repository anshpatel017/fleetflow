import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
    {
        icon: '🚛',
        title: 'Vehicle Tracking',
        desc: 'Monitor your entire fleet in real-time. Track status, location, maintenance schedules, and asset health from a single dashboard.',
    },
    {
        icon: '🗺️',
        title: 'Trip Dispatching',
        desc: 'Dispatch trips with smart validation — cargo checks, driver compliance, and vehicle availability enforced automatically.',
    },
    {
        icon: '📊',
        title: 'Financial Analytics',
        desc: 'Track fuel costs, maintenance expenses, and per-vehicle ROI. Make data-driven decisions with real-time KPIs.',
    },
];

const stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '50K+', label: 'Trips Tracked' },
    { value: '2,400+', label: 'Active Vehicles' },
    { value: '98%', label: 'Dispatch Accuracy' },
];

export default function HomePage() {
    return (
        <div className="min-h-screen" style={{ background: '#1C1C1E' }}>
            <Navbar />

            {/* ── Hero Section ──────────────────────── */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                {/* Animated grid overlay */}
                <div className="route-grid" />

                {/* Animated logistics lines */}
                <div className="logistics-line" style={{ top: '20%', left: '0', width: '60%', animationDelay: '0s' }} />
                <div className="logistics-line" style={{ top: '40%', left: '20%', width: '80%', animationDelay: '1.5s' }} />
                <div className="logistics-line" style={{ top: '65%', left: '5%', width: '50%', animationDelay: '3s' }} />
                <div className="logistics-line" style={{ top: '80%', left: '30%', width: '70%', animationDelay: '0.8s' }} />

                {/* Gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
                    style={{ background: 'radial-gradient(circle, #3B9FD4, transparent)' }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8"
                    style={{ background: 'radial-gradient(circle, #D4500A, transparent)', opacity: 0.08 }} />

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 fade-up"
                        style={{ background: 'rgba(59,159,212,0.1)', border: '1px solid rgba(59,159,212,0.2)' }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: '#3B9FD4', boxShadow: '0 0 8px rgba(59,159,212,0.6)' }} />
                        <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#3B9FD4' }}>
                            Fleet Management Platform
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-6 fade-up" style={{ animationDelay: '0.1s' }}>
                        <span className="text-white">Fleet</span>
                        <span style={{ color: '#3B9FD4' }}>Flow</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed fade-up" style={{ color: 'rgba(244,242,238,0.6)', animationDelay: '0.2s' }}>
                        Centralize your fleet operations. Track vehicles, trips, drivers, and costs in one powerful hub built for modern logistics.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 fade-up" style={{ animationDelay: '0.3s' }}>
                        <Link to="/signup"
                            className="px-8 py-4 rounded-xl text-white font-bold text-base no-underline transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)', boxShadow: '0 4px 24px rgba(212,80,10,0.3)' }}>
                            Get Started →
                        </Link>
                        <Link to="/login"
                            className="px-8 py-4 rounded-xl font-bold text-base no-underline transition-all duration-300 hover:scale-105"
                            style={{ color: '#3B9FD4', border: '2px solid rgba(59,159,212,0.4)', background: 'transparent' }}>
                            Log In
                        </Link>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto fade-up" style={{ animationDelay: '0.4s' }}>
                        {stats.map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl md:text-3xl font-black" style={{ color: '#3B9FD4' }}>{s.value}</div>
                                <div className="text-xs font-medium mt-1" style={{ color: 'rgba(244,242,238,0.4)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 float-anim">
                    <span className="text-xs font-medium" style={{ color: 'rgba(244,242,238,0.3)' }}>Scroll</span>
                    <div className="w-5 h-8 rounded-full border-2 flex justify-center pt-1.5"
                        style={{ borderColor: 'rgba(244,242,238,0.15)' }}>
                        <div className="w-1 h-2 rounded-full" style={{ background: 'rgba(244,242,238,0.3)' }} />
                    </div>
                </div>
            </section>

            {/* ── Features Section ──────────────────── */}
            <section id="features" className="py-24 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: '#D4500A' }}>
                            Core Features
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
                            Everything you need to manage your fleet
                        </h2>
                        <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(244,242,238,0.5)' }}>
                            From dispatch to analytics, FleetFlow handles the complexity so you can focus on operations.
                        </p>
                    </div>

                    {/* Feature cards */}
                    <div className="grid md:grid-cols-3 gap-6 stagger">
                        {features.map((f, i) => (
                            <div key={i}
                                className="glass-card rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 fade-up cursor-default group"
                                style={{ animationDelay: `${i * 0.12}s` }}>
                                {/* Icon */}
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 transition-transform duration-300 group-hover:scale-110"
                                    style={{ background: 'rgba(59,159,212,0.1)', border: '1px solid rgba(59,159,212,0.15)' }}>
                                    {f.icon}
                                </div>
                                {/* Title */}
                                <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                                {/* Description */}
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(244,242,238,0.5)' }}>{f.desc}</p>
                                {/* Accent line */}
                                <div className="mt-6 h-0.5 w-12 rounded transition-all duration-300 group-hover:w-20"
                                    style={{ background: 'linear-gradient(90deg, #D4500A, transparent)' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── About / CTA Section ──────────────── */}
            <section id="about" className="py-24 px-6 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="glass-card rounded-3xl p-12 md:p-20 relative overflow-hidden">
                        {/* Background glow */}
                        <div className="absolute inset-0 opacity-20"
                            style={{ background: 'radial-gradient(ellipse at center, rgba(212,80,10,0.3), transparent 70%)' }} />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
                                Ready to streamline your fleet?
                            </h2>
                            <p className="text-base md:text-lg max-w-xl mx-auto mb-10" style={{ color: 'rgba(244,242,238,0.5)' }}>
                                Join thousands of logistics companies using FleetFlow to reduce costs, increase efficiency, and maintain compliance.
                            </p>
                            <Link to="/signup"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-base no-underline transition-all duration-300 hover:scale-105"
                                style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)', boxShadow: '0 4px 24px rgba(212,80,10,0.3)' }}>
                                Start Free Trial
                                <span className="text-lg">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ───────────────────────────── */}
            <footer className="py-12 px-6" style={{ borderTop: '1px solid rgba(244,242,238,0.06)' }}>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white font-black text-xs"
                            style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                            FF
                        </div>
                        <span className="font-bold text-sm" style={{ color: '#3B9FD4' }}>FleetFlow</span>
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(244,242,238,0.3)' }}>
                        © 2025 FleetFlow. Built for modern logistics.
                    </p>
                </div>
            </footer>
        </div>
    );
}
