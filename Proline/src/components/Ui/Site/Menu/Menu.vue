<script setup lang="ts">
import Facebook from '@components/Ui/Icons/Facebook.vue';
import Instagram from '@components/Ui/Icons/Instagram.vue';
import Linkedin from '@components/Ui/Icons/Linkedin.vue';
import MenuItem from './MenuItem.vue';
import { onBeforeUnmount, ref, watch } from 'vue';

interface Props {
    currentPath: string;
}
defineProps<Props>();

const MenuItems = [
    { label: 'Homepage', url: '/' },
    { label: 'Process', url: '/process/' },
    { label: 'Projects', url: '/projects/' },
    { label: 'Capabilities', url: '/capability-statements/' },
    { label: 'Insights', url: '/insights/' },
    { label: 'About Us', url: '/about-us/' },
    { label: 'Contact', url: '/contact/' },
];

const menuOpen = ref(false);

function toggleMenu() {
    menuOpen.value = !menuOpen.value;
}

function closeMenu() {
    menuOpen.value = false;
}

function handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') closeMenu();
}

watch(menuOpen, isOpen => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
        document.addEventListener('keydown', handleEscape);
    } else {
        document.removeEventListener('keydown', handleEscape);
    }
});

onBeforeUnmount(() => {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscape);
});
</script>

<template>
    <nav class="flex h-full items-center">
        <div class="hidden h-full lg:flex">
            <ul
                class="flex items-center justify-center text-base lg:relative lg:justify-start lg:gap-0"
            >
                <MenuItem
                    v-for="item in MenuItems"
                    :key="item.label"
                    :label="item.label"
                    :url="item.url"
                    :currentPath="currentPath"
                />
            </ul>
            <ul class="my-3 flex items-center gap-3 border-l border-white/25 pl-8">
                <li>
                    <a
                        href="https://www.instagram.com/prolinegroupau"
                        target="_blank"
                        class="flex items-center justify-center font-bold text-[#E4405F] transition-transform duration-300 hover:-translate-y-0.5"
                    >
                        <Instagram class="h-6" />
                    </a>
                </li>
                <li>
                    <a
                        href="https://www.facebook.com/prolinemetalcladding/"
                        target="_blank"
                        class="flex items-center justify-center font-bold text-[#1877F2] transition-transform duration-300 hover:-translate-y-0.5"
                    >
                        <Facebook class="h-6" />
                    </a>
                </li>
                <li>
                    <a
                        href="https://www.linkedin.com/company/proline-metal-cladding/"
                        target="_blank"
                        class="flex items-center justify-center font-bold text-[#0A66C2] transition-transform duration-300 hover:-translate-y-0.5"
                    >
                        <Linkedin class="h-6" />
                    </a>
                </li>
            </ul>
        </div>
        <button
            type="button"
            aria-label="Toggle navigation menu"
            :aria-expanded="menuOpen"
            class="z-50 flex h-[calc(4rem-1px)] w-16 items-center justify-center transition-colors duration-500 ease-in-out lg:hidden"
            :class="menuOpen ? 'bg-transparent' : 'bg-3ds-orange'"
            @click="toggleMenu"
        >
            <div
                class="hamburger-button h-[20px] w-6"
                :class="{ open: menuOpen }"
            >
                <span class="bg-proline-red"></span>
                <span class="bg-proline-red"></span>
                <span class="bg-proline-red"></span>
            </div>
        </button>
    </nav>

    <Teleport to="body">
        <Transition name="slide">
            <div
                v-if="menuOpen"
                class="fixed inset-0 z-40 overflow-y-auto bg-[#050505] px-8 pb-10 pt-24 text-white"
            >
                <ul class="flex min-h-full flex-col font-khand text-3xl font-bold">
                    <li
                        v-for="item in MenuItems"
                        :key="item.label"
                        class="border-b border-white/10"
                    >
                        <a
                            :href="item.url"
                            class="block py-4 transition-colors duration-300 hover:text-proline-red"
                            :class="currentPath === item.url ? 'text-proline-red' : 'text-white'"
                            @click="closeMenu"
                        >
                            {{ item.label }}
                        </a>
                    </li>
                    <li class="mt-auto pt-8">
                        <ul class="flex items-center gap-5">
                            <li>
                                <a
                                    href="https://www.instagram.com/prolinegroupau"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Proline on Instagram"
                                    class="flex items-center justify-center text-[#E4405F]"
                                >
                                    <Instagram class="h-7" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.facebook.com/prolinemetalcladding/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Proline on Facebook"
                                    class="flex items-center justify-center text-[#1877F2]"
                                >
                                    <Facebook class="h-7" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.linkedin.com/company/proline-metal-cladding/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Proline on LinkedIn"
                                    class="flex items-center justify-center text-[#0A66C2]"
                                >
                                    <Linkedin class="h-7" />
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </Transition>
    </Teleport>
</template>

<style>
.slide-enter-active {
    transition: all 0.5s ease-in-out;
}

.slide-leave-active {
    transition: all 0.5s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100vw);
}

.hamburger-button {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: 0.5s ease-in-out;
    -moz-transition: 0.5s ease-in-out;
    -o-transition: 0.5s ease-in-out;
    transition: 0.5s ease-in-out;
}
.hamburger-button span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    opacity: 1;
    left: 0;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: 0.5s ease-in-out;
    -moz-transition: 0.5s ease-in-out;
    -o-transition: 0.5s ease-in-out;
    transition: 0.5s ease-in-out;
}

.hamburger-button span:nth-child(1) {
    top: 0px;
}

.hamburger-button span:nth-child(2) {
    top: 9px;
}

.hamburger-button span:nth-child(3) {
    top: 18px;
}

.hamburger-button.open span:nth-child(1) {
    top: 9px;
    -webkit-transform: rotate(135deg);
    -moz-transform: rotate(135deg);
    -o-transform: rotate(135deg);
    transform: rotate(135deg);
}

.hamburger-button.open span:nth-child(2) {
    opacity: 0;
    left: -60px;
}

.hamburger-button.open span:nth-child(3) {
    top: 9px;
    -webkit-transform: rotate(-135deg);
    -moz-transform: rotate(-135deg);
    -o-transform: rotate(-135deg);
    transform: rotate(-135deg);
}
</style>
