<template>
    <div>
        <!-- Modal -->
        <div v-if="showAddPostModal"
            class="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 overflow-auto">
            <div
                class="bg-white p-6 sm:p-8 rounded-xl w-full max-w-lg max-h-[90vh] text-gray-800 relative overflow-y-auto shadow-lg">
                <h3 class="text-2xl font-semibold text-center mb-4">{{ editingIndex !== null ? "Edit Post" : "Add Post"
                }}</h3>

                <!-- Title -->
                <div class="mb-4">
                    <label class="block text-lg font-medium mb-2">Title</label>
                    <input v-model="form.title" type="text" placeholder="Enter post title..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                </div>

                <!-- Image -->
                <div class="mb-4">
                    <label class="block text-lg font-medium mb-2">Upload Image</label>
                    <input type="file" @change="handleImage"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                    <div v-if="isUploadingImage" class="flex items-center mt-2">
                        <svg class="animate-spin h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                        </svg>
                        <span class="text-sm">Uploading...</span>
                    </div>
                    <div v-if="form.image && !isUploadingImage" class="text-sm mt-1 text-gray-600">
                        Selected: {{ form.image.name }}
                    </div>
                </div>

                <!-- Content -->
                <div class="mb-4">
                    <label class="block text-lg font-medium mb-2">Content</label>
                    <QuillEditor v-model:content="form.content" toolbar="full" contentType="html"
                        :options="editorOptions" />
                </div>

                <!-- Category -->
                <div class="mb-4">
                    <label class="block text-lg font-medium mb-2">Select Category <span
                            class="text-red-500">*</span></label>
                    <div class="relative">
                        <input v-model="searchQuery" @focus="showCategoryList = true" @blur="hideCategoryList"
                            placeholder="Search categories..."
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                        <ul v-if="showCategoryList && filteredCategories.length > 0"
                            class="absolute bg-white border w-full mt-1 z-10 rounded max-h-40 overflow-y-auto shadow-lg">
                            <li v-for="(cat, index) in filteredCategories" :key="index"
                                @mousedown.prevent="selectCategory(cat)"
                                class="px-4 py-2 hover:bg-indigo-100 cursor-pointer">
                                {{ cat.name }}
                            </li>
                        </ul>
                        <div v-if="showCategoryList && filteredCategories.length === 0"
                            class="absolute bg-white border w-full mt-1 z-10 rounded p-2 shadow-lg text-center text-gray-500">
                            No categories found
                        </div>
                    </div>
                    <div v-if="form.category" class="mt-2 text-sm text-gray-600">
                        Selected: {{ getCategoryName() }}
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-4">
                    <button @click="cancelEdit"
                        class="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-200">Cancel</button>
                    <button v-if="!isLoading" @click="saveContent"
                        class="px-6 py-2 bg-indigo-600 text-white rounded hover:opacity-90">Save</button>
                    <button v-else disabled
                        class="px-6 py-2 bg-indigo-600 text-white rounded flex items-center justify-center">
                        <svg class="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                        </svg>
                        Saving...
                    </button>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="mt-4 text-red-500 text-center">
                    {{ errorMessage }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useCategoryStore } from '@/stores/Categories'
import { storeToRefs } from 'pinia'
import { usePostStore } from '@/stores/PostStore'
import axios from 'axios'

const props = defineProps({
    showAddPostModal: {
        type: Boolean,
        required: true
    }
})

const postStore = usePostStore();
const { allPosts } = storeToRefs(postStore);
const { fetchPost } = postStore;

const emit = defineEmits(['close', 'post-saved'])

const editorOptions = {
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['clean']
        ]
    },
    placeholder: 'Write your content here...',
    theme: 'snow'
}

const form = ref({
    title: '',
    image: null,
    content: '',
    category: null
})

const searchQuery = ref('')
const showCategoryList = ref(false)
const isUploadingImage = ref(false)
const isLoading = ref(false)
const editingIndex = ref(null)
const errorMessage = ref('')

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const { fetchCategories } = categoryStore;

onMounted(async () => {
    try {
        await fetchCategories()
    } catch (error) {
        errorMessage.value = 'Failed to load categories. Please refresh the page.'
    }
})

watch(() => props.showAddPostModal, (newVal) => {
    if (!newVal) {
        searchQuery.value = ''
        showCategoryList.value = false
    }
})

const filteredCategories = computed(() => {
    if (!searchQuery.value) return categories.value || [];
    return (categories.value || []).filter(cat => {
        if (cat && cat.name) {
            return cat.name.toLowerCase().includes(searchQuery.value.toLowerCase());
        }
        return false;
    });
});

const handleImage = event => {
    const file = event.target.files[0]
    if (file) {
        isUploadingImage.value = true
        setTimeout(() => {
            form.value.image = file
            isUploadingImage.value = false
        }, 2000)
    }
}

const selectCategory = category => {
    form.value.category = category
    searchQuery.value = category.name
    showCategoryList.value = false
}

const getCategoryName = () => {
    const cat = form.value.category
    if (!cat) return ''
    if (typeof cat === 'string') return cat
    return cat.name || ''
}

const hideCategoryList = () => {
    setTimeout(() => (showCategoryList.value = false), 100)
}

const validateForm = () => {
    if (!form.value.title.trim()) {
        errorMessage.value = 'Please enter a title'
        return false
    }

    if (!form.value.content.trim()) {
        errorMessage.value = 'Please enter content'
        return false
    }

    if (!form.value.category) {
        errorMessage.value = 'Please select a category'
        return false
    }

    return true
}

const saveContent = async () => {
    // Reset error message
    errorMessage.value = ''

    // Validate form
    if (!validateForm()) {
        return
    }

    isLoading.value = true

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication token not found')
        }

        const formData = new FormData()
        formData.append('title', form.value.title)
        formData.append('content', form.value.content)
        formData.append('category', form.value.category.name)
        formData.append('image', form.value.image)

        const response = await axios.post(
            'https://backend-5gsq.onrender.com/api/news',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }

        );
        await postStore.fetchPost();
        emit('post-saved', response.data)
        closeModal()

    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Failed to save post. Please try again.'
    } finally {
        isLoading.value = false
    }
}

const cancelEdit = () => {
    closeModal()
}

const closeModal = () => {
    form.value = {
        title: '',
        image: null,
        content: '',
        category: null
    }
    searchQuery.value = ''
    editingIndex.value = null
    errorMessage.value = ''
    emit('close')
}
</script>