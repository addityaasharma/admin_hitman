import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useCategoryStore = defineStore('categoryStore', () => {
    const categories = ref([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://backend-5gsq.onrender.com/api/categories', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            categories.value = response.data || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    return {
        categories,
        fetchCategories, // ✅ Correct: function reference, not a call
    };
});
