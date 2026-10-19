import dns from 'node:dns'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

dns.setDefaultResultOrder('ipv4first')

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  plugins: [
    react(),
    {
      name: 'hamyon-bank-api',
      configureServer(server) {
        server.middlewares.use('/api/bank', async (req, res) => {
          const handlerUrl = pathToFileURL(path.resolve('api/bankHandler.js')).href
          const { handleBank } = await import(handlerUrl)
          await handleBank(req, res)
        })
      },
    },
  ],
})
