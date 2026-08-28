import { defineConfig } from 'astro/config';
// import cloudflare from '@astrojs/cloudflare';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';

// The URL of your site, used below.
const site = process.env.URL || 'https://prolinegroup.au';

// https://astro.build/config
export default defineConfig({
    // adapter: cloudflare(),
    adapter: netlify(),
    integrations: [
        vue(),
        tailwind(),
        sitemap({
            filter: page =>
                page !== `${site}/404/` &&
                page !== `${site}sent/` &&
                page !== `${site}first-look/`,
        }),
    ],
    image: {
        domains: ['maps.googleapis.com'],
        remotePatterns: [
            {
                protocol: 'https',
            },
        ],
    },
    output: 'static',
    site,
});
