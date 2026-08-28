<script setup lang="ts">
import type { MenuItem } from 'types';

const { label, url, currentPath } = defineProps<MenuItem>();
</script>

<template>
    <li
        class="flex h-full gap-4 lg:flex-col lg:items-center lg:justify-center lg:gap-4 lg:space-y-4"
    >
        <a
            :href="url"
            class="flex h-full items-center justify-center px-5 py-2 font-khand font-bold text-white transition-colors duration-300 hover:text-proline-red"
            :class="{
                'bg-proline-red text-white': currentPath === url,
            }"
            :target="url.startsWith('/') ? '_self' : '_blank'"
        >
            {{ label }}
        </a>
    </li>
</template>
