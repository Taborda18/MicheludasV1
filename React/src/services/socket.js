import { io } from 'socket.io-client';

// Derivar URL del backend sin /api
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_BASE.replace(/\/api$/, '');

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true,
});

export default socket;
