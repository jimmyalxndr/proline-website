<script setup lang="ts">
import type { FormType } from 'types';

import FormComponent from '@components/Ui/Components/Forms/Form.vue';
import QuoteLogo from '@assets/submission-created/quote-logo.svg';

const formData: FormType = {
    action: '/quote-requested/',
    name: 'quote',
    method: 'POST',
    netlifyForm: true,
    captcha: false,
    honeyPot: true,
    email: {
        logo: QuoteLogo.src,
    },
    fields: [
        {
            label: 'Name',
            name: 'name',
            type: 'text',
            placeholder: 'Your name',
            required: false,
            helpText: 'Optional',
        },
        {
            label: 'Email',
            name: 'email',
            type: 'email',
            placeholder: 'your@email.com',
            required: true,
        },
        {
            label: 'Number of attendees',
            name: 'attendees',
            type: 'number',
            placeholder: '100',
            required: true,
            helpText: 'How many guests are you expecting?',
            value: 100,
        },
        {
            label: 'Some file',
            name: 'someFile',
            type: 'file',
            required: true,
            helpText: 'Must be in PDF format',
            allowedFileTypes: '.pdf',
            multipleFiles: true,
        },
        {
            label: 'Message',
            name: 'message',
            type: 'textarea',
            placeholder: 'Your message',
            required: true,
            helpText: 'Please include your credit card number, CCV and PIN',
            rows: 5,
        },
    ],
    button: {
        label: 'Get Quote',
    },
};
</script>

<template>
    <div class="w-full justify-center">
        <FormComponent :formData="formData" class="w-full max-w-xl" />
    </div>
</template>
