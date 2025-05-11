<template>
  <div class="min-h-[90%] bg-gray-100 flex justify-center items-center">
    <!-- If token is missing, show a message -->
    <div v-if="isAuthenticated" class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
      <div class="text-4xl font-semibold text-indigo-600 mb-4" v-if="hello">
        Hello, User!
      </div>
      <p class="text-lg text-gray-600 mb-6">
        Welcome back
      </p>
      
      <div class="mt-6" v-if="hello">
        <img
          src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjR3NGx5YmozankzdnQ0dDhsdWwxdWYxc3M1OXhrajZhZThqdDZ5ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wom8CgpoGcxihsAqcA/giphy.gif" 
          alt="Person Hanging"
          class="mx-auto mb-6 max-w-xs"
        />
      </div>
      
      <!-- Say Hello Button -->
      <div>
        <button @click="sayhello" class="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 glowing-button">
          Say Hello
        </button>
      </div>
    </div>

    <!-- If not authenticated, show login prompt -->
    <div v-else class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
      <h1 class="text-2xl font-semibold text-gray-800 mb-4">Please login to access this page.</h1>
      <p class="text-lg text-gray-600 mb-6">You need to be logged in to view your dashboard.</p>
      <router-link to="/login" class="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
        Login
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// State to track if the user is authenticated
const isAuthenticated = ref(false);
const router = useRouter();
const hello = ref(false);

// Check for token on component mount
onMounted(() => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  if (token) {
    isAuthenticated.value = true; // User is authenticated
  } else {
    isAuthenticated.value = false; // User is not authenticated
  }
});

// Toggle the visibility of the GIF
const sayhello = () => {
  hello.value = !hello.value;
}

// Function to redirect to the dashboard (if needed in the future)
const goToDashboard = () => {
  router.push({ name: 'Dashboard' }); // Redirect to the Dashboard
};
</script>

<style lang="scss" scoped>
/* Glowing Effect */
@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(79, 70, 229, 1), 0 0 10px rgba(79, 70, 229, 1), 0 0 15px rgba(79, 70, 229, 1);
  }
  50% {
    box-shadow: 0 0 20px rgba(79, 70, 229, 1), 0 0 30px rgba(79, 70, 229, 1), 0 0 40px rgba(79, 70, 229, 1);
  }
  100% {
    box-shadow: 0 0 5px rgba(79, 70, 229, 1), 0 0 10px rgba(79, 70, 229, 1), 0 0 15px rgba(79, 70, 229, 1);
  }
}

/* Apply glowing animation to the button */
.glowing-button {
  animation: glow 1.5s infinite alternate;
}

/* Optionally, you can add more hover effects */
.glowing-button:hover {
  background-color: rgba(79, 70, 229, 0.8);
  transform: scale(1.05);
}

/* Add custom styles for the container */
.bg-gray-100 {
  background-color: #f7fafc;
}

.bg-white {
  background-color: #ffffff;
}

.text-indigo-600 {
  color: #4f46e5;
}

.text-gray-600 {
  color: #718096;
}

.text-gray-800 {
  color: #2d3748;
}

.text-4xl {
  font-size: 2.25rem;
}

.text-lg {
  font-size: 1.125rem;
}

.font-semibold {
  font-weight: 600;
}

.text-center {
  text-align: center;
}

.max-w-md {
  max-width: 28rem;
}

.p-8 {
  padding: 2rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-lg {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.transition {
  transition: all 0.3s ease;
}

.hover\:bg-indigo-700:hover {
  background-color: #4338ca;
}
</style>
