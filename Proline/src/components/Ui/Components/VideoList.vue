<template>
    <section class="py-20">
        <VideoPopup
            v-if="showVideoPopup"
            :videoUrl="videoUrl"
            client:load
            @close-popup="closeVideoPopup"
            class="mx-auto"
        />

        <div class="space-y-5">
            <h3 class="ml-24">Our Projects</h3>

            <div class="skew-x-[-20deg] border-l border-proline-red pl-3">
                <div class="border-l border-proline-red pl-3">
                    <div class="border-l border-proline-red pl-3">
                        <div
                            class="border-b border-l border-proline-red pl-10"
                        >
                            <h2 class="max-w-xl skew-x-[20deg] pb-5 pl-4">
                                Delivering high-quality cladding solutions for
                                large-scale construction projects with
                                precision, reliability, and expert
                                craftsmanship.
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ml-24 grid gap-5 pt-2 sm:grid-cols-3">
                <div class="w-full space-y-3">
                    <button
                        class="group relative w-full"
                        @click="
                            openVideoPopup(
                                'https://player.vimeo.com/video/1058777256'
                            )
                        "
                    >
                        <Play
                            class="absolute left-1/2 top-1/2 w-14 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out group-hover:scale-110"
                        />
                        <img
                            src="/assets/homepage/morris-moore-thumb.jpg"
                            class="w-full"
                            alt=""
                        />
                    </button>
                    <p>Morris Moore</p>
                </div>

                <div class="w-full space-y-3">
                    <button
                        class="group relative w-full"
                        @click="
                            openVideoPopup(
                                'https://player.vimeo.com/video/1058777571'
                            )
                        "
                    >
                        <Play
                            class="absolute left-1/2 top-1/2 w-14 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out group-hover:scale-110"
                        />
                        <img
                            src="/assets/homepage/albert-fields-thumb.jpg"
                            class="w-full"
                            alt=""
                        />
                    </button>
                    <p>Albert Fields</p>
                </div>

                <div class="w-full space-y-3">
                    <button
                        class="group relative w-full"
                        @click="
                            openVideoPopup(
                                'https://player.vimeo.com/video/1058777768'
                            )
                        "
                    >
                        <Play
                            class="absolute left-1/2 top-1/2 w-14 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out group-hover:scale-110"
                        />
                        <img
                            src="/assets/homepage/antonine-college-thumb.jpg"
                            class="w-full"
                            alt=""
                        />
                    </button>
                    <p>Antonine College</p>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import Play from '@components/Ui/Icons/Play.vue';
import VideoPopup from '@components/Ui/Components/VideoPopup.vue';
export default {
    components: {
        Play,
        VideoPopup,
    },
    data() {
        return {
            showVideoPopup: false,
            videoUrl: '',
        };
    },
    methods: {
        openVideoPopup(videoUrl) {
            this.videoUrl = videoUrl;
            this.showVideoPopup = true;
        },
        closeVideoPopup() {
            this.showVideoPopup = false;
        },
    },
};
</script>
