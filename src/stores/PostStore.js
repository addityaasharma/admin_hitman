// stores/PostStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export const usePostStore = defineStore('Posts', () => {
  const allPosts = ref({ message: '', newsArticles: [] })

  const fetchPost = async () => {
    try {
      const response = await axios.get('https://backend-5gsq.onrender.com/api/news', {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      allPosts.value = response.data || { message: '', newsArticles: [] }

    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  return {
    allPosts,
    fetchPost
  }
})
