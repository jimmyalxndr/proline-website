<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

interface Props {
    title: string;
    pages: string[];
    pdf: string;
}

const props = defineProps<Props>();
const currentPage = ref(1);
const isMobile = ref(false);
const viewer = ref<HTMLElement | null>(null);
const touchStartX = ref<number | null>(null);

const totalPages = computed(() => props.pages.length);
const visiblePages = computed(() => {
    if (isMobile.value || currentPage.value === 1) {
        return [currentPage.value];
    }

    const firstPage = currentPage.value % 2 === 0
        ? currentPage.value
        : currentPage.value - 1;

    return [firstPage, firstPage + 1].filter(page => page <= totalPages.value);
});

const progress = computed(() => `${(currentPage.value / totalPages.value) * 100}%`);
const canGoBack = computed(() => currentPage.value > 1);
const canGoForward = computed(() => currentPage.value < totalPages.value);

let mobileQuery: MediaQueryList | null = null;

function updateViewport(event?: MediaQueryListEvent) {
    isMobile.value = event ? event.matches : Boolean(mobileQuery?.matches);
}

function nextPage() {
    if (!canGoForward.value) return;

    if (isMobile.value || currentPage.value === 1) {
        currentPage.value += 1;
    } else {
        currentPage.value = Math.min(currentPage.value + 2, totalPages.value);
    }
}

function previousPage() {
    if (!canGoBack.value) return;

    if (isMobile.value) {
        currentPage.value -= 1;
    } else if (currentPage.value <= 2) {
        currentPage.value = 1;
    } else {
        currentPage.value -= 2;
    }
}

function goToPage(page: number) {
    if (!isMobile.value && page > 1 && page % 2 !== 0) {
        currentPage.value = page - 1;
        return;
    }

    currentPage.value = page;
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') nextPage();
    if (event.key === 'ArrowLeft') previousPage();
}

function handleTouchStart(event: TouchEvent) {
    touchStartX.value = event.changedTouches[0]?.clientX ?? null;
}

function handleTouchEnd(event: TouchEvent) {
    if (touchStartX.value === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.value;
    const distance = endX - touchStartX.value;

    if (Math.abs(distance) > 45) {
        distance < 0 ? nextPage() : previousPage();
    }

    touchStartX.value = null;
}

async function toggleFullscreen() {
    if (!viewer.value) return;

    if (document.fullscreenElement) {
        await document.exitFullscreen();
    } else {
        await viewer.value.requestFullscreen();
    }
}

onMounted(() => {
    mobileQuery = window.matchMedia('(max-width: 767px)');
    updateViewport();
    mobileQuery.addEventListener('change', updateViewport);
});

onBeforeUnmount(() => {
    mobileQuery?.removeEventListener('change', updateViewport);
});
</script>

<template>
    <div
        ref="viewer"
        class="book-viewer border border-white/15 bg-[#090909] shadow-2xl shadow-black/50"
        tabindex="0"
        role="region"
        :aria-label="`${title} document reader`"
        @keydown="handleKeydown"
    >
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-7">
            <div>
                <p class="!text-xs font-semibold uppercase tracking-[0.16em] !text-proline-red">
                    Interactive document
                </p>
                <h3 class="mt-1 !text-white">{{ title }}</h3>
            </div>

            <div class="flex flex-wrap gap-2">
                <button
                    type="button"
                    class="hidden min-h-10 items-center border border-white/20 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-proline-red hover:text-proline-red sm:inline-flex"
                    @click="toggleFullscreen"
                >
                    Full screen
                </button>
                <a
                    :href="pdf"
                    download
                    class="inline-flex min-h-10 items-center bg-white px-4 text-xs font-semibold uppercase tracking-[0.08em] text-black transition-colors hover:bg-proline-red hover:text-white"
                >
                    Download PDF
                </a>
            </div>
        </div>

        <div
            class="relative flex min-h-[32rem] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(214,72,41,0.10),transparent_34rem)] p-4 sm:p-7 md:min-h-[46rem] lg:min-h-[52rem]"
            @touchstart.passive="handleTouchStart"
            @touchend.passive="handleTouchEnd"
        >
            <button
                type="button"
                aria-label="Previous page"
                :disabled="!canGoBack"
                class="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/80 text-2xl text-white backdrop-blur transition-all hover:border-proline-red hover:text-proline-red disabled:pointer-events-none disabled:opacity-20 sm:left-5"
                @click="previousPage"
            >
                ←
            </button>

            <div
                class="flex w-full max-w-6xl items-center justify-center gap-1 px-7 sm:px-14"
            >
                <TransitionGroup name="page" tag="div" class="contents">
                    <div
                        v-for="page in visiblePages"
                        :key="page"
                        class="page-sheet relative min-w-0 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
                        :class="[
                            visiblePages.length === 2 && page === visiblePages[0] ? 'md:origin-right' : '',
                            visiblePages.length === 2 && page === visiblePages[1] ? 'md:origin-left' : '',
                        ]"
                    >
                        <img
                            :src="pages[page - 1]"
                            :alt="`${title}, page ${page}`"
                            class="block h-full w-full object-cover"
                            draggable="false"
                        />
                        <span class="absolute bottom-2 right-3 bg-black/70 px-2 py-1 text-[0.65rem] font-semibold text-white/80 backdrop-blur">
                            {{ page }}
                        </span>
                    </div>
                </TransitionGroup>
            </div>

            <button
                type="button"
                aria-label="Next page"
                :disabled="!canGoForward"
                class="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/80 text-2xl text-white backdrop-blur transition-all hover:border-proline-red hover:text-proline-red disabled:pointer-events-none disabled:opacity-20 sm:right-5"
                @click="nextPage"
            >
                →
            </button>
        </div>

        <div class="border-t border-white/10 px-5 py-5 md:px-7">
            <div class="mb-4 flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.1em] text-white/60">
                <span>
                    Page {{ visiblePages[0] }}<template v-if="visiblePages.length > 1">–{{ visiblePages[visiblePages.length - 1] }}</template>
                    of {{ totalPages }}
                </span>
                <span class="hidden sm:inline">Use arrow keys or swipe to turn pages</span>
            </div>

            <div class="mb-4 h-px overflow-hidden bg-white/15">
                <div class="h-full bg-proline-red transition-[width] duration-300" :style="{ width: progress }"></div>
            </div>

            <div class="flex gap-2 overflow-x-auto pb-1">
                <button
                    v-for="page in totalPages"
                    :key="page"
                    type="button"
                    class="flex h-9 min-w-9 items-center justify-center border text-xs font-semibold transition-colors"
                    :class="visiblePages.includes(page) ? 'border-proline-red bg-proline-red text-white' : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'"
                    :aria-label="`Go to page ${page}`"
                    @click="goToPage(page)"
                >
                    {{ page }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.book-viewer:fullscreen {
    overflow: auto;
    background: #050505;
}

.page-sheet {
    width: 100%;
    max-width: min(36rem, calc(78vh * 17 / 22));
    aspect-ratio: 17 / 22;
    flex: 0 1 auto;
    background: #111;
}

@media (min-width: 768px) {
    .page-sheet {
        width: calc(50% - 0.125rem);
    }
}

.page-enter-active,
.page-leave-active {
    transition: opacity 220ms ease, transform 300ms ease;
}

.page-enter-from {
    opacity: 0;
    transform: translateX(1rem) scale(0.985);
}

.page-leave-to {
    opacity: 0;
    transform: translateX(-1rem) scale(0.985);
}
</style>
