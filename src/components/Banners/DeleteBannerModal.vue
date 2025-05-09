<template>
    <div class="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
        <h2 class="text-lg font-semibold mb-2">Delete Banner</h2>
        <p class="text-gray-600 mb-6">Are you sure you want to delete this banner?</p>
        <div class="flex justify-center gap-4">
          <button @click="$emit('close')" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">Cancel</button>
          <button @click="$emit('confirm')" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md">
            Delete
          </button>
        </div>
      </div>
    </div>
  </template>
  