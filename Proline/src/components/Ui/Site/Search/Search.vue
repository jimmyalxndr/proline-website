<script setup lang="ts">
import Icon from '@components/Ui/Icons/Icon.vue';

const openSearch = () => {
    alert('TODO: Setup search functionality.');
};
</script>
<template>
    <div class="">
        <button
            aria-label="search"
            class="group flex w-full items-center justify-center px-8 py-4 hover:bg-gray-800 focus:bg-gray-700 active:bg-gray-700"
            @click="openSearch()"
        >
            <Icon
                name="Search"
                class="block h-6 w-auto transition-transform duration-300 ease-out group-hover:scale-105 group-focus:scale-105 group-active:scale-100 lg:h-14"
            />
        </button>
    </div>
</template>
