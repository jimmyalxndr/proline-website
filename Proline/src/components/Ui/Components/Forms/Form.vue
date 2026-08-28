<script setup lang="ts">
import Button from '@components/Ui/Components/Forms/Button.vue';
import Input from '@components/Ui/Components/Forms/Input.vue';
import Notice from '@components/Ui/Components/Notice/Notice.vue';
import type { DrupalFormType, FormType } from '@utils/types.ts';
import { ref } from 'vue';

/*******************************************************************************
 * NOTE:
 * You shouldn't need to edit this file.
 ******************************************************************************/

interface Props {
    formData: DrupalFormType | FormType;
}
const { formData } = defineProps<Props>();

// Declare grecaptcha as a global to satisfy TypeScript.
declare const grecaptcha: any;
const recaptchaPublicKey = import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY;

const useRecaptcha =
    formData.service !== 'netlify' && formData.captcha && recaptchaPublicKey;

const submitting = ref(false);
const success = ref(false);
const error = ref(false);

const submitData = async (event: Event) => {
    submitting.value = true;

    // If it's not a JS form...
    if (formData.submitType !== 'js') {
        // Simply submit the form as normal.
        const formElement = event.target as HTMLFormElement;
        formElement.submit();
        return;
    }

    const formElement = event.target as HTMLFormElement;
    // Start with all fields from the form.
    const formDataObj = new FormData(formElement);

    // If set, always get a reCAPTCHA token and add it to the form data (except for Netlify).
    if (useRecaptcha) {
        const publicKey = import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY;
        if (typeof grecaptcha === 'undefined') {
            error.value = true;
            submitting.value = false;
            console.error('⚠️  reCAPTCHA not loaded.');
            return;
        }
        try {
            // Get the token from reCAPTCHA v3.
            const token = await new Promise<string>((resolve, reject) => {
                grecaptcha.ready(function () {
                    grecaptcha
                        .execute(publicKey, { action: 'submit' })
                        .then((token: string) => resolve(token))
                        .catch((err: unknown) => reject(err));
                });
            });

            // Add the token to the form data as 'captcha'.
            formDataObj.set('captcha', token as string);
        } catch (e) {
            error.value = true;
            submitting.value = false;
            console.error('⚠️  reCAPTCHA token error:', e);
            return;
        }
    }

    // If it's for Drupal...
    if (formData.service === 'drupal') {
        // Ensure all file inputs are merged into one called files[attachments][], as needed by the module.
        for (const field of Array.from(formElement.elements)) {
            // Only process input elements.
            if (!(field instanceof HTMLInputElement)) continue;
            if (
                field.type === 'file' &&
                field.files &&
                field.files.length > 0
            ) {
                // Remove any existing file fields from FormData.
                formDataObj.delete(field.name);
                // Append each file with the correct backend name.
                for (const file of Array.from(field.files)) {
                    formDataObj.append('files[attachments][]', file);
                }
            }
        }

        // Always add required top-level fields (note, will overwrite any existing).
        formDataObj.set('form', formData.name);
        formDataObj.set(
            'form_id',
            String((formData as DrupalFormType)?.formId ?? '')
        );
    }

    try {
        const response = await fetch(formData.action || '', {
            body: formDataObj,
            method: formData.method || 'POST',
        });

        if (!response.ok) {
            error.value = true;
            submitting.value = false;
            console.error(
                '⚠️  Error response submitting form:',
                response.statusText
            );
            return;
        }

        const data = await response.json();

        if (data?.error) {
            error.value = true;
            submitting.value = false;
            console.error('⚠️  Error from backend:', data.error);
            return;
        }
        error.value = false;
        success.value = true;
        submitting.value = false;
    } catch (e) {
        error.value = true;
        submitting.value = false;
        console.error('⚠️  Error submitting form:', e);
    }
};
</script>

<template>
    <div>
        <component
            is="script"
            v-if="useRecaptcha"
            :src="`https://www.google.com/recaptcha/api.js?render=${recaptchaPublicKey}`"
            async
            defer
        ></component>
        <component
            is="style"
            v-if="useRecaptcha"
            :src="`https://www.google.com/recaptcha/api.js?render=${recaptchaPublicKey}`"
            async
            defer
        >
            .grecaptcha-badge { visibility: hidden; }
        </component>
        <form
            v-if="!success"
            :id="`form-${formData.name}`"
            class="flex w-full flex-col gap-8"
            :name="formData.name"
            :action="formData?.action || undefined"
            :method="formData?.method || 'POST'"
            :enctype="
                formData?.fields.some(field => field.type === 'file')
                    ? 'multipart/form-data'
                    : undefined
            "
            :netlify-honeypot="formData?.honeyPot ? 'bot-field' : undefined"
            :aria-busy="submitting ? 'true' : 'false'"
            aria-live="polite"
            :data-netlify-recaptcha="formData?.captcha || undefined"
            v-bind="formData?.service === 'netlify' ? { netlify: '' } : {}"
            @submit.prevent="submitData"
        >
            <Notice v-if="error" :styleType="'error'">
                <template #title> Error </template>
                <template #body>
                    There was an error submitting the form. Please try again
                    later.
                </template>
            </Notice>

            <!-- Output each of the form fields. -->
            <Input
                v-for="field in formData.fields"
                :key="`${formData.submitType}-${field.name}`"
                :allowedFileTypes="field.allowedFileTypes"
                :autocomplete="field.autocomplete"
                :helpText="field.helpText"
                :label="field.label"
                :max="field.max"
                :maxLength="field.maxLength"
                :min="field.min"
                :minLength="field.minLength"
                :multipleFiles="field.multipleFiles"
                :name="field.name"
                :pattern="field.pattern"
                :placeholder="field.placeholder"
                :required="field.required"
                :rows="field.rows"
                :type="field.type"
                :value="field.value"
            />

            <!-- Conditionally output the Netlify honeypot field. -->
            <input
                v-if="formData.honeyPot"
                class="hidden"
                name="bot-field"
                label="Don't fill this out if you're human"
                type="text"
            />

            <!-- The name of the form. -->
            <input
                name="formName"
                :value="formData.name.toLowerCase()"
                type="hidden"
            />

            <!-- Pass our email logo path to the serverless function. -->
            <input
                v-if="formData?.email?.logo"
                name="logoImage"
                :value="formData.email.logo"
                type="hidden"
            />

            <!-- Conditionally output the Netlify recaptcha. -->
            <div
                v-if="formData.service === 'netlify' && formData.captcha"
                data-netlify-recaptcha="true"
            ></div>

            <!-- ARIA live region for submitting status. -->
            <div v-if="submitting" class="sr-only" aria-live="polite">
                Submitting, please wait.
            </div>

            <Button
                :icon="submitting ? 'Spinner' : formData?.button.icon"
                :label="submitting ? 'Submitting…' : formData?.button.label"
                :disabled="submitting ? true : undefined"
                class="mr-auto"
            />

            <small v-if="useRecaptcha" class="text-xs opacity-70">
                This site is protected by reCAPTCHA and the Google
                <a
                    class="underline hover:text-fuchsia-200 focus:text-fuchsia-200 active:text-fuchsia-200"
                    href="https://policies.google.com/privacy"
                >
                    Privacy Policy
                </a>
                and
                <a
                    class="underline hover:text-fuchsia-200 focus:text-fuchsia-200 active:text-fuchsia-200"
                    href="https://policies.google.com/terms"
                >
                    Terms of Service
                </a>
                apply.
            </small>
        </form>

        <div v-else aria-live="polite" aria-atomic="true">
            <Notice :styleType="'success'">
                <template #title> Sent! </template>
                <template #body>
                    Thank you for getting in touch, we will get back to you as
                    soon as possible.
                </template>
            </Notice>
        </div>
    </div>
</template>
