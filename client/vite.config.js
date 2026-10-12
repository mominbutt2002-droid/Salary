import path from 'path'
import { pathToFileURL } from 'url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
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
