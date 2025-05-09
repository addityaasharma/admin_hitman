<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
        <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
            <!-- Close Button -->
            <button class="absolute top-3 right-3 text-gray-600 hover:text-red-500" @click="closeModal">
                ✖
            </button>

            <!-- Title -->
            <h2 class="text-xl font-bold mb-4 text-center text-gray-800">
                Add New Category
            </h2>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Image Upload -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Upload Image
                    </label>
                    <input type="file" accept="image/*" @change="handleImage" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-700
                     hover:file:bg-indigo-100" />
                    <div v-if="imagePreview" class="mt-2">
                        <img :src="imagePreview" alt="Preview" class="w-full h-40 object-cover rounded-md shadow" />
                    </div>
                </div>

                <!-- Category Name -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Category Name
                    </label>
                    <input type="text" v-model="categoryName" placeholder="Enter category name"
                        class="border border-black border-opacity-10 w-full text-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required />
                </div>

                <!-- Submit Button -->
                <button type="submit"
                    class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                    Add Category
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    isOpen: Boolean,
})
const emits = defineEmits(['close', 'submit'])

const categoryName = ref('')
const imageFile = ref(null)
const imagePreview = ref(null)

const handleImage = (event) => {
    const file = event.target.files[0]
    if (file) {
        imageFile.value = file
        imagePreview.value = URL.createObjectURL(file)
    }
}

const handleSubmit = () => {
    if (!categoryName.value || !imageFile.value) {
        alert('Please provide a name and image.')
        return
    }

    // You can emit to parent to handle submission logic
    emits('submit', {
        name: categoryName.value,
        image: imageFile.value,
    })

    resetForm()
    emits('close')
}

const closeModal = () => {
    resetForm()
    emits('close')
}

const resetForm = () => {
    categoryName.value = ''
    imageFile.value = null
    imagePreview.value = null
}
</script>