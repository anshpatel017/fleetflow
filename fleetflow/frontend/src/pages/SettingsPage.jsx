export default function SettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center py-20 fade-up">
            <span className="text-5xl mb-4">⚙️</span>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#1C1C1E' }}>
                Settings
            </h2>
            <p className="text-sm mt-2" style={{ color: 'rgba(28,28,30,0.5)' }}>
                Configure your FleetFlow preferences.
            </p>
        </div>
    );
}
