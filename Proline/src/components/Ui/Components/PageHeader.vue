<template>
    <div
        class="relative overflow-hidden border-b border-white/10"
        :class="compact ? 'min-h-52 md:min-h-80' : 'min-h-80'"
    >
        <img
            src="/assets/landing.png"
            alt=""
            class="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div
            class="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"
        ></div>
        <div
            class="relative mx-auto flex w-full max-w-screen-3xl items-end px-6 sm:px-10 lg:px-16 xl:px-20"
            :class="
                compact
                    ? 'min-h-52 pb-8 md:min-h-80 md:pb-14'
                    : 'min-h-80 pb-14'
            "
        >
            <div class="max-w-3xl border-l-2 border-proline-red pl-6">
                <p
                    class="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-proline-red"
                >
                    Proline
                </p>
                <h1
                    class="font-khand text-5xl font-semibold leading-none tracking-tight text-white md:text-7xl"
                >
                    {{ title }}
                </h1>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        compact: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
