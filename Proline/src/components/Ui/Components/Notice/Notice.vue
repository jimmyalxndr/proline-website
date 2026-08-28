<script setup lang="ts">
import IconSvg from '@components/Ui/Icons/Icon.vue';
import type { Icon } from '@utils/types.ts';

interface Props {
    styleType?: 'error' | 'info' | 'success' | 'warning';
}
const { styleType } = defineProps<Props>();

// Map the style to the corresponding icon, default to Exclamation.
let iconType = 'Exclamation';
switch (styleType) {
    case 'info':
        iconType = 'Info';
        break;
    case 'success':
        iconType = 'Check';
        break;
}
</script>

<template>
    <div
        class="bg-linear-to-br mx-auto my-2 flex w-fit max-w-full flex-col gap-3 rounded-2xl from-fuchsia-600 to-fuchsia-900 px-7 py-6 leading-tight text-white"
    >
        <div class="flex place-items-center items-center gap-3">
            <IconSvg class="size-7" :icon="iconType as Icon" />
            <span class="text-2xl font-bold">
                <slot name="title">Umm</slot>
            </span>
        </div>
        <span class="flex flex-col gap-1">
            <slot name="body">Something happened&hellip;</slot>
        </span>
    </div>
</template>
