<script setup lang="ts">
import type { Button } from 'types';
import Icon from '@components/Ui/Icons/Icon.vue';

const { icon, label, url } = defineProps<Button>();

// If there is a URL, use an anchor tag, but otherwise use a button.
const isAnchor = !!url;
</script>

<template>
    <component
        :is="isAnchor ? 'a' : 'button'"
        :type="isAnchor ? undefined : 'submit'"
        :href="isAnchor ? url : undefined"
        class="group inline-flex min-h-12 items-center justify-center gap-2 border border-proline-red bg-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-proline-red hover:bg-proline-red hover:text-white hover:shadow-[0_14px_35px_rgba(214,72,41,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-proline-red"
    >
        <Icon
            v-if="icon"
            :name="icon"
            class="h-6 transition-transform duration-200 group-hover:scale-125 group-focus:scale-125 group-active:scale-125"
        />
        {{ label }}
    </component>
</template>
