<script setup lang="ts">
import type { MapImage } from 'types';

import { getImage } from 'astro:assets';

// Check if the Google Maps API key is set.
const apiKey = import.meta.env?.GOOGLE_MAPS_API_KEY;
if (!apiKey) {
    console.error('The GOOGLE_MAPS_API_KEY environment variable is not set.');
}

// Props.
interface Props extends MapImage {
    class?: string;
}
const { center, zoom, height, width, markers } = defineProps<Props>();

// Generate the map image URL.
const encodedCenter = encodeURIComponent(center);
let imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedCenter}&zoom=${zoom}&size=${width}x${height}&key=${apiKey}`;
// Append the markers, if any.
if (markers) {
    const encodedMarkers = encodeURIComponent(markers);
    imageUrl += `&markers=${encodedMarkers}`;
}
// Append the scale parameter to get a higher resolution image.
const imageScaledUrl = `${imageUrl}&scale=4`;

// Fetch the map image using Astro.
const mapImage = await getImage({
    src: imageScaledUrl,
    height,
    width,
    densities: [0.25, 0.5, 1, 1.5, 2, 3, 4],
    format: 'webp',
});

// Generate the Google Maps click-through link.
const mapsLink = `https://www.google.com/maps/@?api=1&map_action=map&center=${center}&zoom=${zoom * 1.2}&markers=${markers}`;
</script>

<template>
    <a
        v-if="apiKey"
        class="block h-full w-full bg-slate-800"
        :class="class"
        :href="mapsLink"
        rel="noopener noreferrer"
        target="_blank"
        title="Open in Google Maps"
    >
        <img
            alt="Map"
            class="h-full w-full"
            loading="lazy"
            :height="height"
            :width="width"
            :src="mapImage.src"
            :srcset="
                mapImage.srcSet.values
                    .map(({ url, descriptor }) => `${url} ${descriptor}`)
                    .join(', ')
            "
        />
    </a>
    <div
        v-else
        class="my-8 block h-full w-full bg-red-800 p-4 text-center text-white"
    >
        <p>
            The <code>GOOGLE_MAPS_API_KEY</code> environment variable is not
            set.
        </p>
    </div>
</template>
