<template>
    <div class="flex">
        <!-- Main Content -->
        <div class="flex-1">
            <div class="w-full mt-4 px-4">
                <div class="flex justify-between items-center h-12 mb-4">
                    <h1 class="text-3xl font-bold text-gray-800">
                        {{ selectedCategoryId ? `Posts in: ${getCategoryName(selectedCategoryId)}` : 'All Posts' }}
                    </h1>
                    <button @click="openAddPostModal"
                        class="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-200">
                        + Add Post
                    </button>
                </div>

                <!-- Add Post Modal -->
                <div v-if="showAddPostModal" class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
                    <AddPost :showAddPostModal="showAddPostModal" @close="closeAddPostModal" />
                </div>

                <!-- Edit Post Modal -->
                <div v-if="showEditPostModal" class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
                    <EditPost :showEditPostModal="showEditPostModal" :postToEdit="postToEdit" @close="closeEditPostModal"
                        @update="updatePost" />
                </div>

                <!-- Delete Post Modal -->
                <div v-if="showDeletePostModal" class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
                    <DeletePost :showDeletePostModal="showDeletePostModal" :postToDelete="postToDelete"
                        @close="closeDeletePostModal" @delete="confirmDeletePost" />
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="h-[575px] flex justify-center items-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>

                <!-- No Posts State -->
                <div v-else-if="filteredPosts.length === 0" class="h-[575px] flex flex-col justify-center items-center">
                    <p class="text-gray-500 text-lg mb-4">
                        {{ selectedCategoryId ? 'No posts found in this category.' : 'No posts available.' }}
                    </p>
                    <button v-if="selectedCategoryId" @click="clearCategoryFilter"
                        class="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 rounded-lg border border-indigo-600 transition">
                        Show all posts
                    </button>
                </div>

                <!-- Posts Grid -->
                <div v-else class="h-[575px] overflow-auto">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <PostCard v-for="post in filteredPosts" :key="post.id || post._id" :post="post"
                            @view="viewFullContent" @edit="editPost" @delete="openDeleteModal" />
                    </div>
                </div>

                <!-- Full Content Modal -->
                <div v-if="selectedPost"
                    class="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50">
                    <div class="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 h-[650px] overflow-auto">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-2xl font-bold text-gray-800">{{ selectedPost.title }}</h3>
                            <button @click="closeFullContent" class="text-gray-600 hover:text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <img :src="selectedPost.image" alt="Full Post Image"
                            class="w-full h-72 object-cover rounded-lg mb-4" />

                        <div v-if="selectedPost.category"
                            class="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
                            {{ selectedPost.category.name }}
                        </div>

                        <div class="text-gray-700 prose max-w-none break-words">
                            <div v-html="selectedPost.content"></div>
                        </div>

                        <div class="mt-6 flex items-center justify-between">
                            <div class="flex items-center">
                                <span class="inline-block bg-gray-200 rounded-full h-10 w-10 mr-3"></span>
                                <div>
                                    <p class="font-medium text-gray-800">{{ selectedPost.author?.username || 'Anonymous'
                                        }}</p>
                                    <p class="text-xs text-gray-500">{{ selectedPost.createdAt || 'No date' }}</p>
                                </div>
                            </div>
                            <button @click="closeFullContent"
                                class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg transition duration-200">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import AddPost from '@/components/Posts/AddPost.vue'
import EditPost from '@/components/Posts/EditPost.vue'
import PostCard from '@/components/Posts/PostCard.vue'
import DeletePost from '@/components/Posts/DeletePost.vue'
import { usePostStore } from '@/stores/PostStore.js'
import { useCategoryStore } from '@/stores/Categories'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const categoryStore = useCategoryStore()
const { allPosts } = storeToRefs(postStore)
const { categories } = storeToRefs(categoryStore)
const selectedCategoryId = ref(null)
const isLoading = ref(false)
const showAddPostModal = ref(false)
const showEditPostModal = ref(false)
const showDeletePostModal = ref(false)
const selectedPost = ref(null)
const postToEdit = ref(null)
const postToDelete = ref(null)

const posts = computed(() => allPosts.value?.newsArticles || [])

const filteredPosts = computed(() => {
    if (!selectedCategoryId.value) {
        return posts.value
    }

    return posts.value.filter(post => {
        const categoryId = post.category?._id || post.categoryId
        return categoryId === selectedCategoryId.value
    })
})

const getCategoryName = (categoryId) => {
    const category = categories.value.find(cat => cat._id === categoryId)
    return category ? category.name : 'Unknown Category'
}

const filterPostsByCategory = async (categoryId) => {
    selectedCategoryId.value = categoryId

    if (categoryId) {
        router.replace({ query: { category: categoryId } })
        await postStore.fetchPost();
    } else {
        router.replace({ query: {} })
    }
}

const clearCategoryFilter = async () => {
    selectedCategoryId.value = null
    router.replace({ query: {} });
    await postStore.fetchPost()
}

watch(
    () => route.query.category,
    async (newCategory) => {
        if (newCategory) {
            selectedCategoryId.value = newCategory
            await postStore.fetchPost(newCategory)
        } else {
            selectedCategoryId.value = null
            await postStore.fetchPost()
        }
    },
    { immediate: true }
)

// Lifecycle
onMounted(async () => {
    isLoading.value = true
    try {
        await Promise.all([
            categoryStore.fetchCategories(),
            postStore.fetchPost(route.query.category)
        ])
        selectedCategoryId.value = route.query.category
    } catch (error) {
        console.error('Initial load error:', error)
    } finally {
        isLoading.value = false
    }
})

const openAddPostModal = () => {
    showAddPostModal.value = true
}

const closeAddPostModal = () => {
    showAddPostModal.value = false
}

const editPost = (post) => {
    postToEdit.value = { ...post }
    showEditPostModal.value = true
}

const closeEditPostModal = () => {
    showEditPostModal.value = false
    postToEdit.value = null
}

const updatePost = (updatedPost) => {
    const index = posts.value.findIndex(post => post.id === updatedPost.id)
    if (index !== -1) {
        posts.value[index] = updatedPost
    }
}

const openDeleteModal = (postId) => {
    const post = posts.value.find(post => post._id === postId || post.id === postId)
    if (post) {
        postToDelete.value = post
        showDeletePostModal.value = true
    }
}

const closeDeletePostModal = () => {
    showDeletePostModal.value = false
    postToDelete.value = null
}

const confirmDeletePost = async (post) => {
    try {
        const deletePost = await axios.delete(`https://backend-5gsq.onrender.com/api/news/deletenews/${post._id}`, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        await postStore.fetchPost()
    } catch (error) {
        console.error('Error deleting post:', error)
    }
}

const viewFullContent = (post) => {
    selectedPost.value = post
}

const closeFullContent = () => {
    selectedPost.value = null
}
</script>

<style scoped>
/* Add any additional styles here */
</style>