<template>
  <div  class="h-screen w-screen overflow-hidden relative grid grid-cols-2 bg-[url('/src/images/6158983.png')] bg-center bg-cover">
      <div></div>
      <div class=" flex items-center">
        <div class="bg-white bg-opacity-80 w-96 h-96 rounded-3xl ">
            <h1 class="text-orange-500 text-4xl font-semibold text-center mt-7">Login</h1>
            <div class="flex flex-col gap-3 ">
            <span class="text-orange-500 text-xl font-semibold mt-5 ml-10">Username</span>
            <input type="text" v-model="email" class="rounded-3xl p-3 text-center text-cyan-700 border-2 border-orange-600 ml-8 mr-8 placeholder:text-red-600 " placeholder="Input your username!">
          </div>
          <div class="flex flex-col gap-3 ">
            <span class="text-orange-500 text-xl font-semibold mt-5 ml-10">Password</span>
            <input type="password" v-model="password" class="rounded-3xl p-3 text-center text-cyan-700 border-2 border-orange-600 ml-8 mr-8 placeholder:text-red-600 " placeholder="Input your password!">
          </div>
          <button
          @click="login"
          class="rounded-3xl p-3 text-center text-white border-2 border-orange-600 bg-orange-600 mt-5 ml-32 px-12">
          Login
          </button>
        </div>
      </div>
    </div>
  </template>
  


<script>

import { ref } from 'vue';
import api from '../axios/Axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const route = useRouter();
    const userData = ref(null);

    const login = async () => {
      try {
        const response = await api.post('/login', {
          email: email.value,
          password: password.value,
        });

        const { token, role, name, id } = response.data;

        if (token) {
          sessionStorage.setItem('auth_token', token);
          sessionStorage.setItem('name', name);
          sessionStorage.setItem('role', role);
          sessionStorage.setItem('id', id);
        } else {
          alert('No token returned from the server.');
          return;
        }

        if (role === 'admin') {
          route.push({ path: '/admin' });
        } else if (role === 'cooker') {
          route.push({ path: '/kitchen' });
        } else {
          route.push({ path: '/dashboard' });
        }
      } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'An error occurred');
      }
    };

    return {
      email,
      password,
      login,
    };
  },
};
</script>

<style scoped>
input::placeholder {
  color: #a0aec0;
  /* Tailwind's gray-400 */
}
</style>