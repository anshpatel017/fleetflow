export default function KPICard({ title, value, icon, color, change }) {
    return (
        <div className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
            <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{icon}</span>
                {change && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: `${color}15`, color }}>
                        {change}
                    </span>
                )}
            </div>
            <p className="text-3xl font-black tracking-tight" style={{ color }}>{value}</p>
            <p className="text-xs font-medium mt-1" style={{ color: 'rgba(28,28,30,0.45)' }}>{title}</p>
        </div>
    );
}
