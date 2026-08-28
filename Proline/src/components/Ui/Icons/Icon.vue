<script setup lang="ts">
import type { Icons } from 'types';

import Close from '@components/Ui/Icons/Close.vue';
import DownArrow from '@components/Ui/Icons/DownArrow.vue';
import Email from '@components/Ui/Icons/Email.vue';
import Facebook from '@components/Ui/Icons/Facebook.vue';
import Link from '@components/Ui/Icons/Link.vue';
import Search from '@components/Ui/Icons/Search.vue';
import Share from '@components/Ui/Icons/Share.vue';
import Twitter from '@components/Ui/Icons/Twitter.vue';

const icons: Record<Icons, Function> = {
    Close,
    DownArrow,
    Email,
    Facebook,
    Link,
    Search,
    Share,
    Twitter,
};

interface Props {
    name: Icons;
}

defineProps<Props>();
</script>

<template>
    <component :is="icons[name]" />
</template>
