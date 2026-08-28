<script setup lang="ts">
import type { Card } from 'types';

const { url, title, body } = defineProps<Card>();
</script>

<template>
    <a
        :href="url"
        class="group w-full rounded-lg bg-gray-800/85 p-6 text-lg leading-snug text-white no-underline shadow-inner backdrop-blur transition-all duration-200 hover:scale-101 hover:bg-gray-700 hover:opacity-100 hover:shadow-lg focus:scale-101 focus:bg-gray-700 focus:shadow-lg active:scale-100 active:bg-gray-700 active:shadow-lg"
    >
        <h2
            class="mb-5 text-3xl font-thin text-white transition-colors group-hover:text-fuchsia-400 group-focus:text-fuchsia-400 group-active:text-fuchsia-400"
        >
            {{ title }}
            <span class="opacity-80">&rarr;</span>
        </h2>
        <p class="mt-2">
            {{ body }}
        </p>
    </a>
</template>
