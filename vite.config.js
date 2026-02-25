import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  base: '/12lms/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          utils: ['axios', 'moment', 'date-fns']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

// //runlocal//
// import { fileURLToPath, URL } from 'node:url'
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// export default defineConfig({
//   plugins: [
//     vue(),
//   ],
//   base: '/12lms/',
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8008',
//         changeOrigin: true
//       }
//     }
//   },
//   build: {
//     outDir: 'dist',
//     assetsDir: 'assets',
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ['vue', 'vue-router', 'pinia'],
//           utils: ['axios', 'moment', 'date-fns']
//         }
//       }
//     }
//   },
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     }
//   }
// })