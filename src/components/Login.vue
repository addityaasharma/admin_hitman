<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-800">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        {{ isLogin ? 'Login to your account' : 'Create an account' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-gray-700">Full Name</label>
          <input v-model="form.name" type="text" placeholder="John Doe"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Username</label>
          <input v-model="form.email" type="text" placeholder="xtention"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="form.password" type="password" placeholder="1234"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required />
        </div>

        <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center" :disabled="isLoading">
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up') }}
        </button>
      </form>

      <p class="text-center text-sm mt-6 text-gray-600">
        {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
        <button @click="toggleForm" class="text-indigo-600 hover:underline ml-1" :disabled="isLoading">
          {{ isLogin ? 'Sign up' : 'Login' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import router from '@/router'
import axios from 'axios'
import { reactive, ref } from 'vue'

const isLogin = ref(true)
const isLoading = ref(false)
const form = reactive({
  name: '',
  email: '',
  password: ''
})

const toggleForm = () => {
  if (isLoading.value) return
  
  isLogin.value = !isLogin.value
  form.name = ''
  form.email = ''
  form.password = ''
}

const handleSubmit = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  
  try {
    if (isLogin.value) {
      const loginResponse = await axios.post(
        'https://backend-5gsq.onrender.com/api/auth/login',
        {
          username: form.email,
          password: form.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (loginResponse.status === 200) {
        const {
          token,
          username: nameFromServer,
          categories: fetchedCategories = [],
          banners: fetchedBanners = [],
        } = loginResponse.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          username: nameFromServer,
          token,
          createdAt: new Date().toISOString(),
        }));

        console.log('Login successful!');
        router.push('/welcome');
      }

    } else {
      if (!form.email || !form.password || !form.name) {
        alert('Please fill all fields');
        isLoading.value = false;
        return;
      }

      // Sign up request
      await axios.post(
        'https://backend-5gsq.onrender.com/api/auth/signup',
        {
          username: form.email,
          password: form.password,
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      // Immediately log in after signup
      const loginResponse = await axios.post(
        'https://backend-5gsq.onrender.com/api/auth/login',
        {
          username: form.email,
          password: form.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const {
        token,
        username: nameFromServer,
        categories: fetchedCategories = [],
        banners: fetchedBanners = [],
      } = loginResponse.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        username: nameFromServer,
        token,
        createdAt: new Date().toISOString(),
      }));

      console.log('Signup & login successful!');
      router.push('/welcome');
    }
  } catch (error) {
    console.error('Something went wrong:', error);
    alert('An error occurred. Please try again.');
    isLoading.value = false;
  }
};
</script>