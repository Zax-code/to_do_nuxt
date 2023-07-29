<script setup lang="ts">
const user = useSupabaseUser()
const router = useRouter()
console.log(user.value);
if(user.value)
    router.push('/');
  else
    router.push('/login');
</script>