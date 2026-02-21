import Navbar from '../components/Navbar';

export default function DashboardPage() {
    return (
        <div style={{ background: '#f5f5f4', minHeight: '100vh' }}>
            <Navbar />

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
                {/* Page header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.03em' }}>
                        Dashboard
                    </h1>
                    <p style={{ color: '#a8a29e', fontSize: '0.875rem', marginTop: 6 }}>
                        Your content goes here.
                    </p>
                </div>

                {/* Placeholder area — delete this and add your own content */}
                <div style={{
                    background: '#ffffff',
                    border: '1.5px dashed #d6d3d1',
                    borderRadius: 12,
                    padding: '64px 24px',
                    textAlign: 'center',
                }}>
                    <p style={{ color: '#d6d3d1', fontSize: '0.875rem', fontWeight: 500 }}>
                        Add your dashboard content here
                    </p>
                </div>
            </div>
        </div>
    );
}
