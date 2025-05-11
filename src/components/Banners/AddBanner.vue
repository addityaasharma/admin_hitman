<template>
    <div class="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50">
        <div class="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative">
            <h2 class="text-xl font-semibold mb-4">Add New Banner</h2>

            <form @submit.prevent="submit">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">Banner Image</label>
                    <input type="file" @change="handleImage" required
                        class="mt-1 block w-full border border-gray-300 rounded-md p-2" :disabled="isLoading" />
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">Link</label>
                    <input type="text" v-model="form.link" placeholder="https://example.com" required
                        class="mt-1 block w-full border border-gray-300 rounded-md p-2" :disabled="isLoading" />
                </div>

                <div v-if="errorMessage" class="mb-4 text-red-500 text-sm">
                    {{ errorMessage }}
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md" :disabled="isLoading">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md"
                        :disabled="isLoading">
                        {{ isLoading ? 'Adding...' : 'Add' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

const emit = defineEmits(['banner-added', 'close']);

const form = ref({
    image: null,
    link: '',
});

const isLoading = ref(false);
const errorMessage = ref('');

const handleImage = (e) => {
    form.value.image = e.target.files[0];
};

const submit = async () => {
    if (!form.value.image || !form.value.link) {
        errorMessage.value = 'Please provide both an image and a link';
        return;
    }

    errorMessage.value = '';
    isLoading.value = true;

    const formData = new FormData();
    formData.append('image', form.value.image);
    formData.append('link', form.value.link);

    try {
        const response = await axios.post(
            'https://backend-5gsq.onrender.com/api/banner',
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            }
        );

        emit('banner-added', response.data);
        emit('close');
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Failed to add banner. Please try again.';
    } finally {
        isLoading.value = false;
    }
};
</script>