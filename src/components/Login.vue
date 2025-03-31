<template>
  <div class="min-h-screen bg-gray-300 flex justify-center items-center">
    <div class="w-full max-w-md mx-auto">
      <div class="bg-white rounded-3xl shadow-lg px-12 py-12 w-[550px]">
        <div class="flex items-center justify-center mb-8">
          <img
            class="w-32 h-32 object-cover"
            src="/public/images/Picture1.png"
            alt="Restaurant Logo"
          />
        </div>
        <h2 class="text-3xl font-extrabold text-gray-800 text-center mb-4">
          Welcome Back
        </h2>
        <p class="text-gray-600 text-center mb-6">Please enter your details to login</p>

        <div class="mb-6">
          <label
            class="block text-gray-700 font-medium mb-2"
            for="email"
          >
            Email
          </label>
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="Enter your email"
            class="w-full px-4 py-3 rounded-full shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          />
        </div>

        <div class="mb-6">
          <label
            class="block text-gray-700 font-medium mb-2"
            for="password"
          >
            Password
          </label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-3 rounded-full shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          />
        </div>

        <button
          @click="login"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
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