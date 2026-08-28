<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue';

interface Props extends HtmlHTMLAttributes {
    tag?: string;
}

withDefaults(defineProps<Props>(), {
    tag: 'section',
});
</script>

<template>
    <component :is="tag" class="mx-2">
        <slot />
    </component>
</template>
