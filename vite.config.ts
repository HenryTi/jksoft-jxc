import { ConfigEnv, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export const pathBase = 'jksoft-jxc';

export default defineConfig({
    base: '/' + pathBase,
    plugins: [
        react(),
        tsconfigPaths(),
    ],
});
