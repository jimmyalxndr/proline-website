<template>
    <div class="fixed inset-0 z-50 bg-black/70 px-10">
        <div class="flex h-full">
            <div class="relative mx-auto my-auto w-full max-w-screen-lg">
                <iframe
                    :src="
                        videoUrl +
                        '?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479'
                    "
                    frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture;"
                    class="aspect-video h-full w-full"
                    title="Proline Landing"
                ></iframe>
                <button
                    class="absolute right-0 top-0 h-10 w-10 -translate-y-1/2 translate-x-1/2 rounded-full bg-proline-red"
                    @click="$emit('close-popup')"
                >
                    <Close class="" />
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import Close from '../Icons/Close.vue';
export default {
    components: {
        Close,
    },
    props: {
        videoUrl: {
            type: String,
            required: true,
        },
    },
};
</script>
