<template>
    <div class="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50">
        <div class="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative">
            <h2 class="text-xl font-semibold mb-4">Add New Banner</h2>

            <form @submit.prevent="submit">
                <!-- Banner Image -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">Banner Image</label>
                    <input type="file" @change="handleImage" required
                        class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>

                <!-- Banner Link -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">Link</label>
                    <input type="text" v-model="form.link" placeholder="https://example.com" required
                        class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md">
                        Add
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['submit', 'close']);

const form = ref({
    image: null,
    link: '',
});

const handleImage = (e) => {
    form.value.image = e.target.files[0];
};

const submit = () => {
    if (!form.value.image || !form.value.link) return;
    emit('submit', form.value);
};
</script>