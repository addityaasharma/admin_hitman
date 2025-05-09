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
                <button @click="confirmDelete"
                    class="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition">
                    Delete
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
})

const emits = defineEmits(['close', 'confirm'])

const closeModal = () => {
    emits('close')
}

const confirmDelete = () => {
    emits('confirm') // Emit the confirm event to handle actual deletion
    closeModal() // Close modal after confirmation
}
</script>