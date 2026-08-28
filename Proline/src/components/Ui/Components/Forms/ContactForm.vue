<script setup lang="ts">
import type { FormType } from 'types';

import FormComponent from '@components/Ui/Components/Forms/Form.vue';

const formData: FormType = {
    action: '/sent',
    name: 'contact',
    method: 'POST',
    service: 'netlify',
    captcha: false,
    honeyPot: true,
    fields: [
        {
            label: 'Name',
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            label: 'Email',
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            label: 'Contact Number',
            name: 'number',
            type: 'tel',
            required: true,
        },
        {
            label: 'Location',
            name: 'location',
            type: 'text',
            required: true,
        },
        {
            label: 'Message',
            name: 'message',
            type: 'textarea',
            required: true,
            rows: 6,
        },
    ],
    button: {
        label: 'Send Message',
    },
};
</script>

<template>
    <div class="w-full justify-center">
        <FormComponent :formData="formData" class="w-full max-w-xl" />
    </div>
</template>
