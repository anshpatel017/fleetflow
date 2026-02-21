import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('access_token') || null,

    setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken });
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
    },

    logout: () => {
        set({ user: null, accessToken: null });
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    },

    updateUser: (user) => {
        set({ user });
        localStorage.setItem('user', JSON.stringify(user));
    }
}));

export default useAuthStore;
