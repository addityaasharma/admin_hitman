<template>
    <div class="w-full min-h-screen bg-[#1f2937] text-white flex flex-col shadow-lg">
        <!-- Logo -->
        <div class="flex justify-center items-center h-26 border-b border-gray-700 relative">
            <img :src="oldImage" alt="logo" class="h-[70px] w-[70px] border-2 rounded-full" />

            <button @click="triggerUpload"
                class="absolute mt-12 ml-12 h-[25px] w-[25px] border rounded-full bg-black">✎</button>

            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleImageChange" />
        </div>

        <!-- Action Buttons -->
        <div class="px-4 py-6 space-y-3 border-b border-gray-700">
            <button @click="onAddCategory"
                class="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition">
                <PlusIcon class="w-5 h-5" />
                Add Category
            </button>

            <!-- Modals -->
            <AddCategoryModal v-if="showModal" :is-open="showModal" @close="showModal = false"
                @category-added="saveCategory" />

            <EditCategoryModal v-if="showEditModal" :is-open="showEditModal" :initial-name="categoryToEdit?.name"
                :initial-image="categoryToEdit?.image" :category-id="categoryToEdit?._id" @close="showEditModal = false"
                @category-updated="handleCategoryUpdated" />

            <DeleteModal v-if="showDeleteModal" :is-open="showDeleteModal" :category-name="categoryToDelete?.name"
                :loading="isDeleting" @close="showDeleteModal = false" @confirm="deleteCategory" />



            <button @click="onShowBanners"
                class="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition">
                <ImageIcon class="w-5 h-5" />
                Show Banners
            </button>

            <button @click="resetCategoryFilter"
                class="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-400 hover:bg-indigo-500 transition">
                <ListIcon class="w-5 h-5" />
                All Posts
            </button>
        </div>

        <!-- Category List -->
        <div class="h-[400px] flex-1 overflow-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-600 border-">
            <h3 class="text-gray-400 text-sm font-semibold">Categories</h3>

            <ul v-if="categoryList.length" class="space-y-1 overflow-auto h-[400px] scrollbar-thin">
                <template v-for="(cat, index) in categoryList" :key="cat._id || index">
                    <li :class="[
                        'p-3 mb-2 rounded-lg transition-all group flex justify-between items-center cursor-pointer',
                        selectedCategory === cat._id ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'
                    ]" @click="selectCategory(cat._id)">
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
import AddCategoryModal from '@/components/categoryModals.vue/AddCategoryModal.vue'
import EditCategoryModal from '@/components/categoryModals.vue/EditCategory.vue'
import DeleteModal from '@/components/categoryModals.vue/DeleteCategory.vue'
import router from '@/router'
import { useCategoryStore } from '@/stores/Categories'
import { storeToRefs } from 'pinia'
import axios from 'axios'

const showEditModal = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const dropdownIndex = ref(null)
const categoryToDelete = ref(null)
const categoryToEdit = ref(null)
const selectedCategory = ref(null)
const isDeleting = ref(false)
const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)
const { fetchCategories } = categoryStore
const categoryList = computed(() => categories.value)
const previewImage = ref('default-image.jpg')
const fileInput = ref(null)

const triggerUpload = () => {
  fileInput.value.click()
}

const oldImage = ref();

const fetchlogo = async(req,res)=>{
    try{
        const response = await axios.get('https://backend-5gsq.onrender.com/api/logo',
        {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        }
    )
    oldImage.value = response.data.image
    } catch (error) {
        console.log(error)
    }
}

onMounted(async()=>{
    await fetchlogo()
})

const handleImageChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    previewImage.value = URL.createObjectURL(file)

    const formData = new FormData()
    formData.append('logo', file)

    try {
      const response = await axios.put('https://backend-5gsq.onrender.com/api/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const uploadedImage = response.data.logo[0]?.image
      if (uploadedImage) {
        previewImage.value = uploadedImage;
      }
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }
}


const selectCategory = (categoryId) => {
    selectedCategory.value = categoryId
    router.push({
        path: '/posts',
        query: { category: categoryId }
    })
}

const resetCategoryFilter = () => {
    selectedCategory.value = null
    router.push({ path: '/posts', query: {} })
}

const onAddCategory = () => {
    showModal.value = true
}

const saveCategory = (categoryData) => {
    categories.value.push(categoryData)
    showModal.value = false
}

const editCategory = (index) => {
    categoryToEdit.value = { ...categories.value[index] }
    showEditModal.value = true
    dropdownIndex.value = null
}

const handleCategoryUpdated = (updatedCategory) => {
    const index = categories.value.findIndex(c => c._id === updatedCategory._id)
    if (index !== -1) {
        categories.value[index] = updatedCategory
    }
    showEditModal.value = false
}

const toggleDropdown = (index) => {
    dropdownIndex.value = dropdownIndex.value === index ? null : index
}

const openDeleteModal = (index) => {
    categoryToDelete.value = categories.value[index]
    showDeleteModal.value = true
}

const deleteCategory = async () => {
    if (!categoryToDelete.value?._id) return

    try {
        isDeleting.value = true
        await axios.delete(`https://backend-5gsq.onrender.com/api/categories/category/${categoryToDelete.value._id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        await categoryStore.fetchCategories();
        const index = categories.value.findIndex(c => c._id === categoryToDelete.value._id)
        if (index !== -1) {
            categories.value.splice(index, 1)
        }

        if (selectedCategory.value === categoryToDelete.value._id) {
            resetCategoryFilter()
        }
    } catch (error) {
        console.error('Error deleting category:', error)
    } finally {
        showDeleteModal.value = false
        isDeleting.value = false
    }
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