<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { useShare } from '@vueuse/core';
import Icon from '@components/Ui/Icons/Icon.vue';
import { OnClickOutside } from '@vueuse/components';
import { ref } from 'vue';

interface Props {
    title: string;
    url: string;
    flyout?: boolean;
}

const { title = 'Article', url, flyout = true } = defineProps<Props>();
const escapedUrl = encodeURIComponent(url);
const escapedTitle = encodeURIComponent(title);
const source = ref(url);
const {
    text,
    copy,
    copied,
    isSupported: isClipboardSupported,
} = useClipboard({ source, copiedDuring: 3000 });
const { share, isSupported: isShareSupported } = useShare({
    title: title,
    url: url,
});

const toggled = ref(false);

const onToggle = () => {
    toggled.value = !toggled.value;
};

const onClickOutsideHandler = () => {
    toggled.value = false;
};
</script>
<template>
    <OnClickOutside @trigger="onClickOutsideHandler">
        <div class="relative inline-block text-left text-sm">
            <button
                class="focus-visible:ring-primary group flex w-full items-center justify-center gap-2 rounded-sm px-4 py-2 font-medium transition-all duration-200 hover:bg-gray-50 hover:text-fuchsia-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 active:bg-gray-50 active:text-fuchsia-600"
                type="button"
                :aria-expanded="toggled"
                aria-haspopup="true"
                @click.stop="onToggle"
                id="share-menu-btn"
            >
                <span class="inline-block w-4">
                    <Icon name="Share" />
                </span>
                Share
                <span class="inline-block w-4">
                    <Icon
                        name="DownArrow"
                        class="transition-transform duration-200 group-hover:scale-125 group-focus:scale-125 group-active:scale-125"
                    />
                </span>
            </button>

            <div
                v-show="toggled"
                class="absolute left-0 z-10 w-auto origin-top-right whitespace-nowrap bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus-visible:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="share-menu-btn"
                tabindex="-1"
            >
                <a
                    :href="`https://facebook.com/sharer/sharer.php?u=${escapedUrl}`"
                    class="group flex items-center gap-2 px-4 py-2 transition-colors duration-200 hover:bg-slate-50 hover:text-fuchsia-600 focus:bg-gray-50 focus:text-fuchsia-600 active:bg-gray-50 active:text-fuchsia-600"
                    role="menuitem"
                    tabindex="-1"
                >
                    <span class="inline-block w-4">
                        <Icon
                            name="Facebook"
                            class="transition-transform duration-200 group-hover:scale-110 group-focus:scale-110 group-active:scale-110"
                        />
                    </span>
                    Facebook
                </a>
                <a
                    :href="`https://twitter.com/intent/tweet?url=${escapedUrl}`"
                    class="group flex items-center gap-2 px-4 py-2 transition-colors duration-200 hover:bg-slate-50 hover:text-fuchsia-600 focus:bg-gray-50 focus:text-fuchsia-600 active:bg-gray-50 active:text-fuchsia-600"
                    role="menuitem"
                    tabindex="-1"
                >
                    <span class="inline-block w-4">
                        <Icon
                            name="Twitter"
                            class="transition-transform duration-200 group-hover:scale-110 group-focus:scale-110 group-active:scale-110"
                        />
                    </span>
                    Twitter
                </a>
                <button
                    v-if="isClipboardSupported"
                    @click="copy()"
                    class="copy-url flex items-center gap-2 px-4 py-2 transition-colors duration-200 hover:bg-slate-50 hover:text-fuchsia-600 focus:bg-gray-50 focus:text-fuchsia-600 active:bg-gray-50 active:text-fuchsia-600"
                    role="menuitem"
                    tabindex="-1"
                    type="button"
                >
                    <span class="inline-block w-4">
                        <Icon
                            name="Link"
                            class="transition-transform duration-200 group-hover:scale-110 group-focus:scale-110 group-active:scale-110"
                        />
                    </span>
                    <span v-if="!copied">Copy Link</span>
                    <span v-else>Copied!</span>
                </button>
                <a
                    :href="`mailto:?subject=${escapedTitle}&amp;body=${escapedUrl}`"
                    class="group flex items-center gap-2 px-4 py-2 transition-colors duration-200 hover:bg-slate-50 hover:text-fuchsia-600 focus:bg-gray-50 focus:text-fuchsia-600 active:bg-gray-50 active:text-fuchsia-600"
                    role="menuitem"
                    tabindex="-1"
                >
                    <span class="inline-block w-4">
                        <Icon
                            name="Email"
                            class="transition-transform duration-200 group-hover:scale-110 group-focus:scale-110 group-active:scale-110"
                        />
                    </span>
                    Email
                </a>
                <button
                    v-if="isShareSupported"
                    @click="share()"
                    class="group flex items-center gap-2 px-4 py-2 transition-colors duration-200 hover:bg-slate-50 hover:text-fuchsia-600 focus:bg-gray-50 focus:text-fuchsia-600 active:bg-gray-50 active:text-fuchsia-600"
                    role="menuitem"
                    tabindex="-1"
                >
                    <span class="inline-block w-4">
                        <Icon
                            name="Share"
                            class="transition-transform duration-200 group-hover:scale-110 group-focus:scale-110 group-active:scale-110"
                        />
                    </span>
                    More&hellip;
                </button>
            </div>
        </div>
    </OnClickOutside>
</template>
