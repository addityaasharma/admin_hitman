<template>
    <div class="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
      <div class="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative">
        <h2 class="text-xl font-semibold mb-4">Edit Banner</h2>
  
        <form @submit.prevent="submit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Banner Image</label>
            <input
              type="file"
              @change="handleImage"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
  
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Link</label>
            <input
              type="text"
              v-model="form.link"
              placeholder="https://example.com"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
  
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    banner: Object,
  });
  
  const emit = defineEmits(['submit', 'close']);
  
  const form = ref({
    image: null,
    link: '',
  });
  
  watch(
    () => props.banner,
    (newVal) => {
      form.value.link = newVal?.link || '';
    },
    { immediate: true }
  );
  
  const handleImage = (e) => {
    form.value.image = e.target.files[0];
  };
  
  const submit = () => {
    emit('submit', form.value);
  };
  </script>
  