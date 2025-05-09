<template>
    <div class="w-full min-h-screen bg-[#1f2937] text-white flex flex-col shadow-lg">
        <!-- Logo -->
        <div class="flex justify-center items-center h-18 border-b border-gray-700">
            <h1 class="text-2xl font-bold tracking-wide">📝 Logo</h1>
        </div>

        <!-- Action Buttons -->
        <div class="px-4 py-6 space-y-3 border-b border-gray-700">
            <button @click="onAddCategory"
                class="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition">
                <PlusIcon class="w-5 h-5" />
                Add Category
            </button>

            <!-- Modals -->
            <AddCategoryModal v-if="showModal" :is-open="showModal" @close="showModal = false" @submit="saveCategory" />
            <EditCategoryModal v-if="showEditModal" :is-open="showEditModal"
                :initial-name="categories[selectedCategoryIndex]?.name" @close="showEditModal = false"
                @submit="updateCategory" />
            <DeleteModal v-if="showDeleteModal" :is-open="showDeleteModal" :category-name="categoryToDelete?.name"
                @close="showDeleteModal = false" @confirm="deleteCategory" />

            <button @click="onShowBanners"
                class="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition">
                <ImageIcon class="w-5 h-5" />
                Show Banners
            </button>

            <button @click="onShowPosts"
                class="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-400 hover:bg-indigo-500 transition">
                <ListIcon class="w-5 h-5" />
                All Posts
            </button>
        </div>

        <!-- Category List -->
        <div class="h-[400px] flex-1 overflow-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-600">
            <h3 class="text-gray-400 text-sm font-semibold">Categories</h3>

            <ul v-if="categoryList.length" class="space-y-1">
                <template v-for="(cat, index) in categoryList" :key="index">
                    <li
                        class="p-3 mb-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all group flex justify-between items-center cursor-pointer">
                        <div class="flex items-center gap-3">
                            <img :src="cat.image" alt="logo" class="w-8 h-8 rounded-full object-cover" />
                            <span class="text-white font-medium">{{ cat.name }}</span>
                        </div>

                        <button @click.stop="toggleDropdown(index)" data-dropdown-toggle
                            class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition duration-200"
                            title="Options">
                            🡣
                        </button>
                    </li>

                    <!-- Dropdown Panel -->
                    <div v-if="dropdownIndex === index"
                        class="dropdown-panel mt-1 bg-gray-700 rounded-lg shadow-md flex gap-2 px-3 py-2 w-max">
                        <button @click.stop="editCategory(index)"
                            class="text-sm text-white hover:bg-gray-600 px-3 py-1 rounded transition">
                            ✏️ Edit
                        </button>
                        <button @click.stop="openDeleteModal(index)"
                            class="text-sm text-white hover:bg-gray-600 px-3 py-1 rounded transition">
                            🗑️ Delete
                        </button>
                    </div>
                </template>
            </ul>

            <div v-else class="text-gray-300 py-4">Loading...</div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { PlusIcon, ImageIcon, ListIcon } from 'lucide-vue-next'
import AddCategoryModal from '@/components/categoryModals.vue/AddCategoryModal.vue'
import EditCategoryModal from '@/components/categoryModals.vue/EditCategory.vue'
import DeleteModal from '@/components/categoryModals.vue/DeleteCategory.vue'
import router from '@/router'
import { useCategoryStore } from '@/stores/Categories'
import { storeToRefs } from 'pinia'

// State
const showEditModal = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedCategoryIndex = ref(null)
const categoryToDelete = ref(null)
const dropdownIndex = ref(null)

// Store
const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)
const { fetchCategories } = categoryStore
const categoryList = computed(() => categories.value)

// Methods
const onAddCategory = () => {
    showModal.value = true
}

const saveCategory = (categoryData) => {
    categories.value.push(categoryData)
    showModal.value = false
}

const editCategory = (index) => {
    selectedCategoryIndex.value = index
    showEditModal.value = true
    dropdownIndex.value = null
}

const updateCategory = (updatedData) => {
    if (selectedCategoryIndex.value !== null) {
        categories.value[selectedCategoryIndex.value] = {
            ...categories.value[selectedCategoryIndex.value],
            ...updatedData,
        }
        showEditModal.value = false
    }
}

const toggleDropdown = (index) => {
    dropdownIndex.value = dropdownIndex.value === index ? null : index
}

const openDeleteModal = (index) => {
    categoryToDelete.value = categories.value[index]
    showDeleteModal.value = true
}

const deleteCategory = () => {
    const index = categories.value.findIndex((c) => c === categoryToDelete.value)
    if (index !== -1) {
        categories.value.splice(index, 1)
    }
    showDeleteModal.value = false
}

const handleClickOutside = (e) => {
    const insideDropdown = e.target.closest('.dropdown-panel')
    const insideToggle = e.target.closest('[data-dropdown-toggle]')
    if (!insideDropdown && !insideToggle) {
        dropdownIndex.value = null
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    fetchCategories()
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

const onShowBanners = () => {
    router.push('/banner')
}

const onShowPosts = () => {
    router.push('/posts')
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: #4b5563;
    border-radius: 3px;
}
</style>