<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-200 to-indigo-300 flex items-center justify-center p-4">
    <div class="w-full max-w-lg transform transition-all duration-300 hover:scale-[1.005]">
      <div class="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 relative overflow-hidden">
        <!-- Decorative elements -->
        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-indigo-400"></div>
        <div class="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-100/20"></div>

        <div class="relative z-10 text-center mb-10">
          <div class="animate-bounce-slow mb-6">
            <img class="w-24 h-24 mx-auto transform hover:rotate-12 transition-transform"
              src="/public/images/Picture1.png" alt="Restaurant Logo">
          </div>
          <h1 class="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back<span class="text-purple-600">.</span>
          </h1>
          <p class="text-gray-500 font-medium">Sign in to manage your kitchen</p>
        </div>

        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label class="block text-gray-700 font-semibold mb-2 ml-1">Email</label>
            <div class="relative">
              <input v-model="email" type="email" placeholder="chef@restaurant.com" class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400
                            focus:ring-2 focus:ring-purple-100 outline-none transition-all
                            placeholder-gray-400">
              <i class="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-2 ml-1">Password</label>
            <div class="relative">
              <input v-model="password" type="password" placeholder="••••••••" class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400
                            focus:ring-2 focus:ring-purple-100 outline-none transition-all
                            placeholder-gray-400">
              <i class="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <button type="submit" class="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3.5 rounded-xl
                         font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all
                         active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400">
            Sign In
            <i class="fas fa-arrow-right ml-2"></i>
          </button>

          <!-- <p class="text-center text-gray-500 mt-6">
            New here?
            <a href="#" class="text-purple-600 font-medium hover:text-purple-700">Create account</a>
          </p> -->
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../axios/Axios';

const email = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    }, { withCredentials: true });

    const { access_token, role, name, id } = response.data;

    if (access_token) {
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('name', name);
      localStorage.setItem('role', role);
      localStorage.setItem('id', id);
      localStorage.setItem('isLoggedIn', 'true');

      const savedRedirect = sessionStorage.getItem('redirectAfterLogin');
      if (savedRedirect) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(savedRedirect);
      } else {
        const redirectPath = role === 'admin' ? '/admin/home' :
          role === 'cooker' ? '/kitchen' : '/dashboard';
        router.push(redirectPath);
      }
    } else {
      alert('Authentication failed: No token received');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};
</script>



<style scoped>
@keyframes bounce-slow {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}

input:focus+i {
  color: #9333ea;
}

input::-webkit-input-placeholder {
  font-family: 'Font Awesome 5 Free', sans-serif;
  font-weight: 900;
}
</style>