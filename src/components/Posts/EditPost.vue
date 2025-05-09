<template>
    <div>
        <!-- Modal -->
        <div v-if="showEditPostModal"
            class="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 overflow-auto">
            <div
                class="bg-white p-6 sm:p-8 rounded-xl w-full max-w-lg max-h-[90vh] text-gray-800 relative overflow-y-auto shadow-lg">
                <h3 class="text-2xl font-semibold text-center mb-4">
                    {{ postToEdit && postToEdit._id ? "Edit Post" : "Add Post" }}
                </h3>

                <!-- Title -->
                <div class="mb-4">
                    <label class="block text-lg font-medium mb-2">Title</label>
                    <input v-model="formData.title" type="text" placeholder="Enter post title..."
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
                    <div v-if="formData.image && !isUploadingImage" class="text-sm mt-1 text-gray-600">
                        Selected: {{ formData.image.name }}
                    </div>
                </div>

                <!-- Content -->
                <div class="mb-4">
                    <label class="block text-lg font-medium mb-2">Content</label>
                    <QuillEditor v-model:content="formData.content" toolbar="full" contentType="html"
                        :options="editorOptions" />
                </div>

                <!-- Category -->
                <div class="mb-4">
                    <label class="block text-lg font-medium mb-2">Select Category</label>
                    <div class="relative">
                        <input v-model="searchQuery" @focus="showCategoryList = true" @blur="hideCategoryList"
                            placeholder="Search categories..."
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                        <ul v-if="showCategoryList"
                            class="absolute bg-white border w-full mt-1 z-10 rounded max-h-40 overflow-y-auto shadow-lg">
                            <li v-for="(cat, index) in filteredCategories" :key="index"
                                @mousedown.prevent="selectCategory(cat)"
                                class="px-4 py-2 hover:bg-indigo-100 cursor-pointer">
                                {{ cat.name }}
                            </li>
                        </ul>
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
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import axios from 'axios';
import { useCategoryStore } from '@/stores/Categories';
import { storeToRefs } from 'pinia';

const props = defineProps({
    showEditPostModal: Boolean,
    postToEdit: Object
});

const emit = defineEmits(['close', 'update']);

const formData = ref({
    title: '',
    image: null, // ✅ initialize image as null
    content: '',
    category: ''
});

const isUploadingImage = ref(false);
const isLoading = ref(false);
const searchQuery = ref('');
const showCategoryList = ref(false);

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const { fetchCategories } = categoryStore;

onMounted(async () => {
    await fetchCategories();
    if (props.postToEdit) {
        formData.value = { ...props.postToEdit };
    }
});

watch(() => props.postToEdit, (newPost) => {
    if (newPost) {
        formData.value = { ...newPost };
    }
}, { deep: true });

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
};

const filteredCategories = computed(() => {
    if (!searchQuery.value) return categories.value || [];
    return (categories.value || []).filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const selectedCategory = computed(() => {
    return (categories.value || []).find(cat =>
        cat.name.toLowerCase() === formData.value.category?.toLowerCase()
    );
});

const handleImage = event => {
    const file = event.target.files[0];
    if (file) {
        isUploadingImage.value = true;
        setTimeout(() => {
            formData.value.image = file;
            isUploadingImage.value = false;
        }, 1000);
    }
};

const selectCategory = category => {
    formData.value.category = category.name;
    searchQuery.value = category.name;
    showCategoryList.value = false;
};

const hideCategoryList = () => {
    setTimeout(() => (showCategoryList.value = false), 100);
};

const saveContent = async () => {
    if (!formData.value.title || !formData.value.content || !formData.value.category) {
        alert('Please fill all fields');
        return;
    }

    isLoading.value = true;

    try {
        const token = localStorage.getItem('token');

        const payload = {
            title: formData.value.title,
            image: formData.value.image,
            content: formData.value.content,
            category: formData.value.category
        };

        const response = await axios.put(
            `https://backend-5gsq.onrender.com/api/news/editnews/${formData.value._id}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        emit('update', response.data);
        emit('close');
        alert('Post updated successfully!');
    } catch (error) {
        console.error(error);
        alert('Failed to update post. Please try again.');
    } finally {
        isLoading.value = false;
    }
};

const cancelEdit = () => {
    emit('close');
};
</script>
