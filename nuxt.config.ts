// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  imports: {
    dirs: ['functionalties'],
  },
  supabase: {
    redirect: {
      login: '/login',
      callback: '/callback',
    },
  }
})
