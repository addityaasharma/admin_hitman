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
                    class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition flex items-center justify-center"
                    :disabled="isSubmitting">
                    <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white mr-2"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                        </path>
                    </svg>
                    <span>{{ isSubmitting ? 'Adding...' : 'Add Category' }}</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useCategoryStore } from '@/stores/Categories'
import axios from 'axios'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

const props = defineProps({
    isOpen: Boolean,
})

const isSubmitting = ref(false)
const emits = defineEmits(['close', 'submit'])
const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const { fetchCategories } = categoryStore;
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

const handleSubmit = async () => {
    if (!categoryName.value || !imageFile.value) {
        alert('Please provide a name and image.')
        return
    }

    const formData = new FormData()
    formData.append('name', categoryName.value)
    formData.append('image', imageFile.value)

    try {
        isSubmitting.value = true;
        await axios.post('https://backend-5gsq.onrender.com/api/categories', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        await categoryStore.fetchCategories()
        emits('submit', {
            name: categoryName.value,
            image: imageFile.value
        })

    } catch (error) {
        console.log('Error Adding Category', error)
    } finally {
        isSubmitting.value = false
        resetForm()
        emits('close')
    }
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