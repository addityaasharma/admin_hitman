<template>
  <div
    class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col border-2 border-indigo-400/40">
    <div class="relative">
      <img :src="post.image" alt="Post image" class="w-full h-52 object-cover" />
      <div v-if="post.category?.name"
        class="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
        {{ post.category.name }}
      </div>

      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
        <div class="p-4 w-full">
          <button @click="$emit('view', post)"
            class="w-full bg-white/90 hover:bg-white text-indigo-700 font-medium py-2 rounded-lg transition duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>

    <div class="p-5 flex-1 flex flex-col">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{{ post.title }}</h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-3" v-html="cleanContent"></p>
      </div>

      <div class="border-t pt-4 mt-auto">
        <div class="flex justify-between items-center">
          <div class="flex items-center text-sm text-gray-500">
            <span class="inline-block bg-gray-200 rounded-full h-8 w-8 mr-2"></span>
            <span>{{ post.author?.username || 'Anonymous' }}</span>
          </div>

          <div class="flex gap-2">
            <button @click="$emit('edit', post)"
              class="p-2 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button @click="$emit('delete', post._id)"
              class="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  emits: ['view', 'edit', 'delete'],
  computed: {
    cleanContent() {
      // Optional: strip or sanitize HTML if needed
      return this.post.content
    }
  }
}
</script>