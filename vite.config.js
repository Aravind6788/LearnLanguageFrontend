export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4174,
    // allowedHosts: ['healhub-3.onrender.com'],
  },
})
