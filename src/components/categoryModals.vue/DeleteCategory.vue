<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
        <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
            <!-- Close Button -->
            <button class="absolute top-3 right-3 text-gray-600 hover:text-red-500" @click="closeModal">
                ✖
            </button>

            <!-- Modal Title -->
            <h2 class="text-xl font-bold mb-4 text-center text-gray-800">
                Are you sure you want to delete this category?
            </h2>

            <!-- Confirmation Message -->
            <p class="text-sm text-gray-600 mb-4 text-center">
                This action cannot be undone.
            </p>

            <!-- Action Buttons -->
            <div class="flex justify-center gap-4">
                <button @click="confirmDelete" :disabled="loading"
                    class="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition flex items-center justify-center">
                    <svg v-if="loading" class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>{{ loading ? 'Deleting...' : 'Delete' }}</span>
                </button>

                <button @click="closeModal"
                    class="bg-gray-300 text-black py-2 px-6 rounded-md hover:bg-gray-400 transition">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    categoryName: String,
    loading : Boolean
})

const emits = defineEmits(['close', 'confirm'])

const closeModal = () => {
    emits('close')
}

const confirmDelete = () => {
    emits('confirm') 
}

</script>