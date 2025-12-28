import { io as ioClient } from 'socket.io-client';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export const socket = ioClient(API_BASE);

export default socket;
