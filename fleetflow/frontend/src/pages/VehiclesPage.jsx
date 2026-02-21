import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const StatusPill = ({ status }) => {
    const configs = {
        available: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', label: 'Available' },
        on_trip: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', label: 'On Trip' },
        in_shop: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', label: 'In Shop' },
        retired: { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-100', label: 'Retired' },
    };
    const config = configs[status] || configs.available;
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
            {config.label}
        </span>
    );
};

export default function VehiclesPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: vehicles, isLoading } = useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => {
            const res = await api.get('/api/fleet/vehicles/');
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/api/fleet/vehicles/${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries(['vehicles']);
            toast.success('Vehicle deleted successfully');
        }
    });

    const filteredVehicles = vehicles?.filter(v =>
        v.name_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Vehicle Registry</h1>
                    <p className="text-sm mt-0.5">Manage physical fleet assets and health.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    Add Vehicle
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-stone-100 flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search fleet..."
                            className="input-field pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Odometer</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [1, 2, 3].map(i => <tr key={i} className="animate-pulse"><td colSpan="6" className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td></tr>)
                            ) : filteredVehicles?.map((vehicle) => (
                                <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold">{vehicle.name_model}</div>
                                        <div className="text-[11px] text-stone-400 font-mono tracking-tighter">{vehicle.license_plate}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm border-stone-200 capitalize">{vehicle.vehicle_type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusPill status={vehicle.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium">{vehicle.max_capacity_kg} <span className="text-stone-400 font-normal">kg</span></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium">{vehicle.odometer_km} <span className="text-stone-400 font-normal">km</span></div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteMutation.mutate(vehicle.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
