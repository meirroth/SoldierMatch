// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
  },
  nitro: {
    plugins: ["@/server/db/index.ts"],
  },
  modules: ['@nuxt/ui'],
  app: {
    head: {
      title: 'SoldierMatch',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'robots', content: 'noindex' }
      ],
    }
  },
});
