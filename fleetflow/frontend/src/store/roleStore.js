import { create } from 'zustand';

const ROLE_LABEL = {
  manager: 'Fleet Manager',
  dispatcher: 'Dispatcher',
  safety_officer: 'Safety Officer',
  analyst: 'Analyst',
};

const useRoleStore = create((set) => ({
  role: (JSON.parse(localStorage.getItem('ff_role') || 'null') ?? 'manager'),
  setRole: (role) => {
    const r = role ?? 'manager';
    localStorage.setItem('ff_role', JSON.stringify(r));
    set({ role: r });
  },
  roleLabel: (role) => ROLE_LABEL[role] ?? role,
}));

export default useRoleStore;
