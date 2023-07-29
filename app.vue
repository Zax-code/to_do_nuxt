<script setup lang="ts">
const user = useSupabaseUser()
const router = useRouter()
watchEffect(() => {
  if (!user.value && router.currentRoute.value.path !== '/login'){
    router.push('/login')
  }
})

const {message_list, pushMessage} = useMessageList();

</script>

<template>
  <div class="bg-gradient-to-br from-slate-950 to-slate-800 text-slate-200 min-h-screen p-4">
            <TransitionGroup name="list" tag="div" class="fixed right-2 top-2 flex flex-col gap-2 z-10 w-1/5">
            <div v-for="{message, id} in message_list" :key="id"
                :class="`rounded-lg p-4 ${message.includes('Erreur') ? 'bg-red-500' : 'bg-green-500'} transition duration-500 w-full`">
                <p class="text-center">{{ message }}</p>
            </div>
        </TransitionGroup>
    <NuxtPage/>
  </div>
</template>
