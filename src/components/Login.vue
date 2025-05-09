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
          <input v-model="form.email" type="text" placeholder="aditya123"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="form.password" type="password" placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required />
        </div>

        <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
          {{ isLogin ? 'Login' : 'Sign Up' }}
        </button>
      </form>

      <p class="text-center text-sm mt-6 text-gray-600">
        {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
        <button @click="toggleForm" class="text-indigo-600 hover:underline ml-1">
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
const form = reactive({
  name: '',
  email: '',
  password: ''
})

const toggleForm = () => {
  isLogin.value = !isLogin.value
  form.name = ''
  form.email = ''
  form.password = ''
}

const handleSubmit = async () => {
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
        router.push('/');
      }

    } else {
      if (!form.email || !form.password || !form.name) {
        alert('Please fill all fields');
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
      router.push('/');
    }
  } catch (error) {
    console.error('Something went wrong:', error);
    alert('An error occurred. Please try again.');
  }
};
</script>
