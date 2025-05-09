<template>
    <div class="w-full mt-4 px-4">
        <div class="flex justify-between items-center h-12 mb-4">
            <h1 class="text-3xl font-bold text-gray-800">All Posts</h1>
            <button @click="openAddPostModal"
                class="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-200">
                + Add Post
            </button>
        </div>

        <!-- AddPostModal Component -->
        <AddPost :showAddPostModal="showAddPostModal" @close="closeAddPostModal" />
        
        <!-- EditPostModal Component -->
        <EditPost 
            :showEditPostModal="showEditPostModal" 
            :postToEdit="postToEdit"
            @close="closeEditPostModal"
            @update="updatePost"
        />

        <!-- Posts Grid -->
        <div class="h-[575px] overflow-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <PostCard v-for="post in posts" :key="post.id" :post="post" @view="viewFullContent" @edit="editPost"
                    @delete="deletePost" />
            </div>
        </div>

        <!-- Full Content Modal -->
        <div v-if="selectedPost" class="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md bg-opacity-50 z-50">
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

                <img :src="selectedPost.image" alt="Full Post Image" class="w-full h-72 object-cover rounded-lg mb-4" />

                <div v-if="selectedPost.category"
                    class="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
                    {{ selectedPost.category.name }}
                </div>

                <div class="text-gray-700 prose max-w-none">
                    <p>{{ selectedPost.content }}</p>
                </div>

                <div class="mt-6 flex items-center justify-between">
                    <div class="flex items-center">
                        <span class="inline-block bg-gray-200 rounded-full h-10 w-10 mr-3"></span>
                        <div>
                            <p class="font-medium text-gray-800">{{ selectedPost.author.username || 'Anonymous' }}</p>
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
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import AddPost from '@/components/Posts/AddPost.vue'
import EditPost from '@/components/Posts/EditPost.vue'
import PostCard from '@/components/Posts/PostCard.vue'
import { usePostStore } from '@/stores/PostStore.js'
import { storeToRefs } from 'pinia'

const postStore = usePostStore()
const { allPosts } = storeToRefs(postStore)

onMounted(async () => {
  await postStore.fetchPost()
  console.log('Fetched posts:', allPosts.value.newsArticles) // ← Now will show correct data
})

// ✅ Make posts reactive
const posts = computed(() => allPosts.value?.newsArticles || [])

const showAddPostModal = ref(false)
const showEditPostModal = ref(false)
const selectedPost = ref(null)
const postToEdit = ref(null)

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

const viewFullContent = (post) => {
    selectedPost.value = post
}

const closeFullContent = () => {
    selectedPost.value = null
}

const deletePost = (postId) => {
    posts.value = posts.value.filter((post) => post.id !== postId)
}
</script>


<style scoped>
/* Optional: Custom styling if needed */
</style>