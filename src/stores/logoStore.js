import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useLogoStore = defineStore('logo', () => {
    const logoList = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    const fetchLogo = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await axios.get('https://backend-5gsq.onrender.com/api/logo', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            logoList.value = response.data.image;
            return response.data;
        } catch (err) {
            console.error('Error Fetching Logo:', err);
            error.value = err.message || 'Failed to fetch logo';
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        logoList,
        isLoading,
        error,
        fetchLogo
    };
});