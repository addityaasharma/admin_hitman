<template>
  <div class="flex">
    <!-- Sidebar: Fixed to the left -->
    <div class="sidebar h-[100vh] w-[15%] bg-amber-400 top-0 left-0">
      <Sidebar />
    </div>

    <!-- Main content area with overflow -->
    <div class="main-content h-[100vh] w-[85%] ml-[15%] overflow-auto">
      <Main/>
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue';
import Main from './Main.vue';
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}

/* Main content area */
.main-content {
  margin-left: 15%;
  overflow-y: auto; /* Allow scrolling if the content overflows */
  height: 100vh; /* Full height of the viewport */
}
</style>
