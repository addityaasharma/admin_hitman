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
                <AddBannerModal v-if="showAddModal" @close="showAddModal = false" @submit="handleAddBanner" />
            </div>
        </div>

        <div class="flex gap-4 flex-wrap overflow-auto h-[520px]">
            <BannerCard v-for="banner in banners" :key="banner.id" :banner="banner" @edit="editBanner"
            @delete="deleteBanner" />
        </div>
    </div>
</template>

<script setup>
import BannerCard from "@/components/Banners/BannerCard.vue";
import AddBannerModal from "@/components/Banners/AddBanner.vue";
import { ref } from "vue";

const banners = ref([
    {
        id: 1,
        image: "https://prestogifts.com/blog/wp-content/uploads/2024/05/Green-Minimalist-Good-Morning-Instagram-Post.png",
        link: "https://example.com/promo-1",
    },
    {
        id: 2,
        image: "https://weddingreturngifts.com/blog/wp-content/uploads/2023/07/png_20230712_210610_0000.jpg",
        link: "https://example.com/promo-2",
    },
    {
        id: 1,
        image: "https://prestogifts.com/blog/wp-content/uploads/2024/05/Green-Minimalist-Good-Morning-Instagram-Post.png",
        link: "https://example.com/promo-1",
    },
    {
        id: 2,
        image: "https://weddingreturngifts.com/blog/wp-content/uploads/2023/07/png_20230712_210610_0000.jpg",
        link: "https://example.com/promo-2",
    },
    {
        id: 1,
        image: "https://prestogifts.com/blog/wp-content/uploads/2024/05/Green-Minimalist-Good-Morning-Instagram-Post.png",
        link: "https://example.com/promo-1",
    },
    {
        id: 2,
        image: "https://weddingreturngifts.com/blog/wp-content/uploads/2023/07/png_20230712_210610_0000.jpg",
        link: "https://example.com/promo-2",
    },
    // Ensure unique IDs for each banner
]);

const editBanner = (id) => {
    console.log("Edit banner with ID:", id);
};

const deleteBanner = (id) => {
    console.log("Delete banner with ID:", id);
};

const showAddModal = ref(false);
const addBanner = () => {
    showAddModal.value = true;
};

const handleAddBanner = (newBanner) => {
    banners.value.push({
        id: Date.now(),  // Unique ID for each new banner
        image: URL.createObjectURL(newBanner.image),  // This is for file inputs
        link: newBanner.link,
    });
    showAddModal.value = false;
};
</script>
