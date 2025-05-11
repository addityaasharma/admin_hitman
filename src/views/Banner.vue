<template>
    <div class="p-8 space-y-6">
        <div class="w-full h-12 flex justify-between">
            <div>
                <h1 class="text-3xl font-bold text-gray-800 mb-4">Banner Manager</h1>
            </div>
            <div>
                <button @click="addBanner"
                    class="bg-indigo-500 hover:bg-indigo-600 active:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-200">
                    + Add Banner
                </button>
                <AddBannerModal v-if="showAddModal" @close="showAddModal = false" @banner-added="handleBannerAdded" />
            </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex justify-center items-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>

        <!-- Error message -->
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {{ errorMessage }}
            <button @click="errorMessage = ''" class="absolute top-0 right-0 px-4 py-3">×</button>
        </div>

        <!-- No banners message -->
        <div v-if="!isLoading && banners.length === 0" class="text-center py-10 text-gray-500">
            No banners found. Add your first banner!
        </div>

        <div v-else class="flex gap-4 flex-wrap overflow-auto h-[520px]">
            <BannerCard v-for="banner in banners" :key="banner.id" :banner="banner" @edit="editBanner"
                @delete="deleteBanner" />
        </div>
    </div>
</template>

<script setup>
import BannerCard from "@/components/Banners/BannerCard.vue";
import AddBannerModal from "@/components/Banners/AddBanner.vue";
import { computed, onMounted, ref } from "vue";
import { useBannerStore } from "@/stores/BannerStore";
import { storeToRefs } from "pinia";
import axios from "axios";

const bannerStore = useBannerStore();
const { bannerList } = storeToRefs(bannerStore);

const showAddModal = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

onMounted(async () => {
    await fetchBanners();
});

const banners = computed(() =>
    bannerList.value.map((b) => ({
        ...b,
        id: b._id || b.id,
    }))
);

const fetchBanners = async () => {
    isLoading.value = true;
    try {
        await bannerStore.fetchBanners();
    } catch (error) {
        errorMessage.value = "Failed to load banners.";
    } finally {
        isLoading.value = false;
    }
};

const addBanner = () => {
    showAddModal.value = true;
};

const handleBannerAdded = async () => {
    await fetchBanners();
};

const editBanner = async (bannerData) => {
    if (!bannerData || !bannerData.id) {
        return;
    }

    const id = bannerData.id || bannerData._id;

    isLoading.value = true;
    try {
        const formData = new FormData();
        if (bannerData.link) {
            formData.append('link', bannerData.link);
        }
        if (bannerData.image && bannerData.image instanceof File) {
            formData.append('image', bannerData.image);
        }

        await axios.put(
            `https://backend-5gsq.onrender.com/api/banner/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            }
        );

        await fetchBanners();
    } catch (error) {
        errorMessage.value = "Failed to update banner. Please try again.";
    } finally {
        isLoading.value = false;
    }
};

const deleteBanner = async (id) => {
    if (!id) {
        return;
    }

    isLoading.value = true;
    try {
        await axios.delete(`https://backend-5gsq.onrender.com/api/banner/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        await fetchBanners();
    } catch (error) {
        errorMessage.value = "Failed to delete banner. Please try again.";
    } finally {
        isLoading.value = false;
    }
};
</script>