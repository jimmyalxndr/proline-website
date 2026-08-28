<template>
    <div class="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="project in projects" :key="project">
            <a
                :href="'/projects/' + project.slug"
                :aria-label="`View ${project.data.title} project`"
                class="group mb-5 block aspect-[4/3] overflow-hidden bg-black"
            >
                <img
                    :src="project.data.featuredImage"
                    :alt="project.data.title"
                    loading="lazy"
                    class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                />
            </a>
            <h3 class="mb-3 text-white">{{ project.data.title }}</h3>
            <a
                :href="'/projects/' + project.slug"
                class="group inline-flex items-center gap-2 font-khand text-lg font-semibold text-proline-red"
                ><span
                    class="transition-transform duration-300 ease-in-out group-hover:scale-110"
                    >See Project</span
                ><Arrow
                    class="transition-transform duration-300 ease-in-out group-hover:translate-x-2"
            /></a>
        </div>
    </div>
</template>
<script>
import Arrow from '../Icons/Arrow.vue';
export default {
    components: {
        Arrow,
    },
    props: {
        projects: {
            type: Array,
            required: true,
        },
    },
};
</script>
