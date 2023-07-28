<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseAuthClient()
if (user.value) {
  navigateTo('/');
}
// Login method using providers
const login = async (provider: 'github' | 'google') => {
  const { error } = await client.auth.signInWithOAuth({ provider })
  if (error) {
    return alert('Something went wrong !')
  }
  navigateTo('/');
}
</script>
<template>
  <button @click="login('github')">Login with GitHub</button>
    <button @click="login('google')">Login with Google</button>
</template>