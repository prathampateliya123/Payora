import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces
    allowedHosts: true, // Allow all hosts like ngrok (Vite 5+)
    // If you are on an older Vite, allowedHosts might be invalid, but usually ignored
    // We can explicitly list ngrok domains if needed:
    // allowedHosts: ['.ngrok.app', '.ngrok-free.app', '.ngrok.io']
  }
});