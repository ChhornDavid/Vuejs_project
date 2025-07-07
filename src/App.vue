<template>
  <RouterView />
</template>

<script>

import { useRouter } from 'vue-router';
import Login from './components/Login.vue';
import Dashboard from './components/dashboard/Dashboard.vue';
import { onMounted } from 'vue';


export default {
  components: {
    Login,
    Dashboard,
  },
  setup() {
    const router = useRouter();

    onMounted(() => {
      const localToken = localStorage.getItem('auth_token');
      const localRole = localStorage.getItem('role');

      if (localToken && localRole) {
        // Rehydrate sessionStorage
        sessionStorage.setItem('auth_token', localToken);
        sessionStorage.setItem('role', localRole);

        // Redirect to the correct dashboard
        const redirectPath = localRole === 'admin' ? '/admin' :
          localRole === 'cooker' ? '/kitchen' : '/dashboard';
        router.push(redirectPath);
      }
    });
  }
}

</script>
<style>
@import 'font-awesome/css/font-awesome.min.css';
</style>