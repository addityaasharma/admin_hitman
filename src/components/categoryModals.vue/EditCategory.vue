<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center">
    <!-- Backdrop overlay with higher z-index -->
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>

    <!-- Modal container with even higher z-index -->
    <div class="absolute bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
      <button
        class="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
        @click="closeModal" aria-label="Close modal">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd" />
        </svg>
      </button>

      <h2 class="text-xl font-bold mb-4 text-center text-gray-800">
        Edit Category
      </h2>

      <!-- Loading overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl z-[10001]">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>

      <!-- Error message -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Change Image (optional)
          </label>
          <input type="file" accept="image/*" @change="handleImage" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100" :disabled="isLoading" />
          <div v-if="imagePreview" class="mt-2">
            <img :src="imagePreview" alt="Preview" class="w-full h-40 object-cover rounded-md shadow-md" />
          </div>
        </div>

        <!-- Category Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input type="text" v-model="categoryName" placeholder="Enter category name"
            class="border border-gray-300 w-full text-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required :disabled="isLoading" />
        </div>

        <!-- Submit Button -->
        <button type="submit"
          class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition font-medium"
          :disabled="isLoading">
          {{ isLoading ? 'Updating...' : 'Update Category' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, watch } from 'vue'
import { useCategoryStore } from '@/stores/Categories'
import { storeToRefs } from 'pinia'

const props = defineProps({
  isOpen: Boolean,
  initialName: String,
  initialImage: String,
  categoryId: String
})

const emits = defineEmits(['close', 'category-updated'])
const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const { fetchCategories } = categoryStore;
const categoryName = ref('')
const imageFile = ref(null)
const imagePreview = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      categoryName.value = props.initialName || ''
      imagePreview.value = props.initialImage || null
      errorMessage.value = ''

      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'auto'
    }
  },
  { immediate: true }
)

const handleImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  if (!categoryName.value.trim()) {
    errorMessage.value = 'Please enter a category name.'
    return
  }

  if (!props.categoryId) {
    errorMessage.value = 'Category ID is missing. Cannot update.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('name', categoryName.value.trim())

    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    const response = await axios.put(
      `https://backend-5gsq.onrender.com/api/categories/category/${props.categoryId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    await categoryStore.fetchCategories()
    emits('category-updated', response.data)
    closeModal()
  } catch (error) {
    console.error('Error updating category:', error)
    errorMessage.value = error.response?.data?.message ||
      'Failed to update category. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  if (isLoading.value) return
  resetForm()
  emits('close')
}

const resetForm = () => {
  categoryName.value = ''
  imageFile.value = null
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = null
  }
}

// Cleanup function to prevent memory leaks
const onBeforeUnmount = () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  document.body.style.overflow = 'auto' // Reset body overflow
}
</script>