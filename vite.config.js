import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { Plugin as importToCDN, autoComplete } from 'vite-plugin-cdn-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    splitVendorChunkPlugin(),
    importToCDN({
      prodUrl: 'https://cdn.gpt123.cool/{name}@{version}/{path}',
      modules: [
        autoComplete('vue'),
        autoComplete('lodash'),
        {
          name: 'vue3-markdown-it',
          var: 'VueMarkdownIt',
          path: 'dist/vue3-markdown-it.umd.min.js'
        }
      ]
    })
  ],
})
