<template>
    <!-- Delete Post Modal -->
    <div v-if="showDeletePostModal" class="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md bg-opacity-50 z-50">
      <div class="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-[500px] p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800">Confirm Delete</h3>
          <button @click="$emit('close')" class="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <div class="mb-6">
          <p class="text-lg text-gray-700">Are you sure you want to delete this post?</p>
          <p class="font-semibold text-gray-900">Title: {{ postToDelete?.title }}</p>
        </div>
  
        <div class="flex justify-end gap-4">
          <button @click="$emit('close')" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
          <button @click="handleDelete" class="px-6 py-2 bg-red-500 rounded-lg text-white font-medium hover:bg-red-600 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    showDeletePostModal: {
      type: Boolean,
      required: true,
    },
    postToDelete: {
      type: Object,
      required: true,
    },
  });
  
  const emit = defineEmits(['close', 'delete']);
  
  const handleDelete = () => {
    // Emit delete event with the post ID or the entire post object
    emit('delete', props.postToDelete);
  
    // Close the modal after deletion
    emit('close');
  };
  </script>
  