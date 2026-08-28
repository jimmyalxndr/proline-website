<script setup lang="ts">
import type { FormField } from 'types';

const {
    label,
    name,
    type,
    placeholder,
    helpText,
    required,
    rows,
    allowedFileTypes,
    multipleFiles,
} = defineProps<FormField>();
</script>

<template>
    <label class="flex flex-col gap-1 text-white">
        <div
            v-if="label || helpText"
            class="flex flex-row items-end justify-between gap-1 leading-tight"
        >
            <span>{{ label }}<span v-if="required">*</span></span>
            <span v-if="helpText" class="text-xs text-white">
                {{ helpText }}
            </span>
        </div>
        <component
            :is="type === 'textarea' ? 'textarea' : 'input'"
            :type="type"
            :name="name"
            :placeholder="placeholder"
            :required="!!required"
            :rows="type === 'textarea' && rows ? rows : undefined"
            :accept="
                type === 'file' && allowedFileTypes
                    ? allowedFileTypes
                    : undefined
            "
            :multiple="
                type === 'file' && multipleFiles ? multipleFiles : undefined
            "
            :value="type !== 'file' && value ? value : undefined"
            class="border border-white bg-transparent p-2 text-white"
        />
    </label>
</template>
