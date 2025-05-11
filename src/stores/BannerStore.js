// store/bannerStore.js
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useBannerStore = defineStore('banners', () => {
    const bannerList = ref([]);

    const fetchBanners = async () => {
        try {
            const response = await axios.get('https://backend-5gsq.onrender.com/api/banner', {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            bannerList.value = response.data.info;
        } catch (error) {
            console.log('Something Error', error);
        }
    };

    return {
        bannerList,
        fetchBanners
    };
});
