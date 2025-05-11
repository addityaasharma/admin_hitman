<template>
  <div class="max-w-lg w-full h-[175px] bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-600/30 hover:border-indigo-900">
    <div class="flex flex-col md:flex-row">
      <!-- Banner Image -->
      <img :src="banner.image" alt="Banner Image" class="w-full md:w-1/3 h-44 object-cover" />

      <!-- Banner Info & Actions -->
      <div class="p-6 flex-1">
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Banner</h2>
        <a :href="banner.link" target="_blank" class="text-blue-600 hover:underline break-all text-sm">
          {{ banner.link }}
        </a>

        <!-- Buttons -->
        <div class="mt-6 flex gap-3">
          <button @click="showEditModal = true"
            class="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md">
            Edit
          </button>
          <button @click="showDeleteModal = true" class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md">
            Delete
          </button>
        </div>
      </div>
    </div>

    <EditBannerModal v-if="showEditModal" :banner="banner" @close="showEditModal = false" @submit="handleUpdate" />

    <DeleteBannerModal v-if="showDeleteModal" @close="showDeleteModal = false" @confirm="handleDelete" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EditBannerModal from './EditBannerModal.vue';
import DeleteBannerModal from './DeleteBannerModal.vue';

const props = defineProps({
  banner: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["edit", "delete"]);

const showEditModal = ref(false);
const showDeleteModal = ref(false);

const handleUpdate = (updatedData) => {
  emit("edit", { id: props.banner._id, ...updatedData });
  showEditModal.value = false;
};

const handleDelete = () => {
  emit("delete", props.banner._id);
  showDeleteModal.value = false;
};
</script>
