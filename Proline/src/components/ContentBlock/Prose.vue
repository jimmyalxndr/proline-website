<script setup lang="ts">
const classes = [
    'prose prose-invert prose-lg max-w-none',
    'prose-headings:font-serif prose-headings:text-3xl prose-headings:font-bold prose-headings:tracking-tight prose-headings:leading-tight',
    'prose-a:decoration-fuchsia-500 prose-a:underline-offset-2 prose-a:transition-all prose-a:duration-200 hover:prose-a:text-fuchsia-600 hover:prose-a:decoration-2',
];
</script>

<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>
