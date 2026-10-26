<script setup lang="ts">
import type { FormType } from 'types';

import FormComponent from '@components/Ui/Components/Forms/Form.vue';

const formData: FormType = {
    action: '/factory-walkthrough/sent',
    name: 'factory-walkthrough',
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
            label: 'Company',
            name: 'company',
            type: 'text',
            required: false,
            helpText: 'Optional',
        },
        {
            label: 'Role',
            name: 'role',
            type: 'text',
            required: false,
            helpText: 'Optional',
        },
        {
            label: 'Phone',
            name: 'phone',
            type: 'tel',
            required: true,
        },
        {
            label: 'Email',
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            label: 'Preferred day or time',
            name: 'preferred_day',
            type: 'text',
            required: true,
        },
    ],
    button: {
        label: 'Enquire about a walkthrough',
    },
};
</script>

<template>
    <div class="w-full">
        <FormComponent :formData="formData" class="w-full" />
        <p class="mt-3 text-xs leading-snug">
            We review each enquiry and reply if a visit suits.
            <a href="/privacy-policy" class="underline hover:text-proline-red">
                Privacy policy
            </a>
        </p>
    </div>
</template>
