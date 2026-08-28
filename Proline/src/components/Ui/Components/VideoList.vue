<template>
    <section class="py-16 md:py-20">
        <VideoPopup
            v-if="showVideoPopup"
            :videoUrl="videoUrl"
            client:load
            @close-popup="closeVideoPopup"
            class="mx-auto"
        />

        <div class="space-y-8 md:space-y-5">
            <div class="mx-auto max-w-3xl space-y-4 text-center md:hidden">
                <h3>Our Projects</h3>

                <h2>
                    Delivering high-quality cladding solutions for large-scale
                    construction projects with precision, reliability, and
                    expert craftsmanship.
                </h2>

                <div class="mx-auto h-px w-20 bg-proline-red"></div>
            </div>

            <div class="hidden md:block">
                <h3 class="ml-24">Our Projects</h3>

                <div class="mt-5 skew-x-[-20deg] border-l border-proline-red pl-3">
                    <div class="border-l border-proline-red pl-3">
                        <div class="border-l border-proline-red pl-3">
                            <div class="border-b border-l border-proline-red pl-10">
                                <h2 class="max-w-xl skew-x-[20deg] pb-5 pl-4">
                                    Delivering high-quality cladding solutions
                                    for large-scale construction projects with
                                    precision, reliability, and expert
                                    craftsmanship.
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mx-auto grid w-full max-w-screen-xl gap-8 sm:grid-cols-3 sm:gap-5 md:ml-24 md:w-[calc(100%-6rem)]">
                <div class="w-full space-y-3 text-center sm:text-left">
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
                            class="aspect-video w-full object-cover"
                            alt=""
                        />
                    </button>
                    <p>Morris Moore</p>
                </div>

                <div class="w-full space-y-3 text-center sm:text-left">
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
                            class="aspect-video w-full object-cover"
                            alt=""
                        />
                    </button>
                    <p>Albert Fields</p>
                </div>

                <div class="w-full space-y-3 text-center sm:text-left">
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
                            class="aspect-video w-full object-cover"
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
