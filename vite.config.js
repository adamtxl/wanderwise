import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');


    return {
        build: {
            outDir: 'build',
        },
        server: {
            proxy: {
                "/api":'http://localhost:5001',
            }
        },
        define: {
            'process.env.REACT_APP_MAPBOX_API_KEY': JSON.stringify(env.REACT_APP_MAPBOX_API_KEY)
          },
        plugins: [react()],
    };
    
});
