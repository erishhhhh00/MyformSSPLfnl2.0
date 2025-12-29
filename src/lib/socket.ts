import { io as ioClient } from 'socket.io-client';

// Detect production environment and use correct API URL
const getApiBase = () => {
    // If env variable is set, use it
    if (import.meta.env.VITE_API_BASE) {
        return import.meta.env.VITE_API_BASE;
    }
    // If running on production (vercel), use Render backend
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
        return 'https://sspl-backend.onrender.com';
    }
    // Default to localhost for development
    return 'http://localhost:4000';
};

const API_BASE = getApiBase();

export const socket = ioClient(API_BASE);

export default socket;

