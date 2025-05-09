<template>
    <div class="flex">
        <div class="h-[100vh] w-[15%] bg-amber-400">
            <Sidebar />
        </div>
        <div class="h-[100vh] w-[85%]">
            <Main/>
            <RouterView/>
        </div>
    </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue';
import Main from './Main.vue';

</script>

<style lang="scss" scoped></style>