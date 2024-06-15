import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { vitePluginVersionMark } from 'vite-plugin-version-mark'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: '',
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        plugins: [['@swc/plugin-emotion', {}]],
      }),
      tsconfigPaths({
        root: '.',
      }),
      vitePluginVersionMark({
        ifShortSHA: true,
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom', 'ahooks'],
            emotion: ['@emotion/react'],
          },
        },
      },
    },
    server: {
      host: true,
      port: Number(env.VITE_PORT) ?? 3000,
      proxy: {
      },
    },
  }
})
