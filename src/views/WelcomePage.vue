<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-6">
    <div class="max-w-2xl text-center space-y-6 animate-fade-in">
      <h1 class="text-4xl sm:text-5xl font-extrabold">
        👋 Welcome <span class="text-indigo-500">{{ userName }}</span>!
      </h1>
      <p class="text-lg sm:text-xl text-gray-300">
        We’re glad to have you at HitNews. Lets Continue to Admin..
      </p>
      <button @click="goToDashboard"
        class="bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-lg">
        Go to Dashboard
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const userName = localStorage.getItem('userName') || 'User'

const goToDashboard = () => {
  router.push('/')
}
</script>

<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}
</style>
