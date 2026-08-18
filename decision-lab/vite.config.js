import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base: GitHub Pages serves project sites under /<repo>/, and the
  // single-file artifact build inlines everything anyway.
  base: './',
  plugins: [react()],
})
