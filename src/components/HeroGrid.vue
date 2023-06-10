<template>
    <div class="d-flex flex-wrap justify-center">
        <v-hover v-for="item in data" :key="item.id">
        <template v-slot:default="{ isHovering, props }">
            <v-card v-bind="props"
                variant="flat"
                :style="{ 'opacity': !app.selected || app.isSelected(item) || isHovering ? 1 : 0.2 }"
                :color="app.isSelected(item) ? 'primary' : (isHovering ? color : undefined)">
                <v-img class="ma-1" cover
                    aspect-ratio="1.7778"
                    :width="width"
                    :max-width="width"
                    cross-origin="anonymous"
                    :src="getHeroSrc(item.official_name)"
                    :lazy-src="placeholder"
                    @click="onClick(item)"/>
            </v-card>
        </template>
        </v-hover>
    </div>
</template>

<script setup>
    import { useApp } from '@/store/app';
    import { getHeroSrc } from '@/use/utils'

    const props = defineProps({
        data: {
            type: Array,
            required: true
        },
        width: {
            type: Number,
            default: 120
        },
        color: {
            type: String,
            default: "black"
        },
        placeholder: {
            type: String,
            default: "/images/Dota_2_logo.png"
        }
    });

    const emit = defineEmits(["click"]);

    const app = useApp();

    function onClick(item) {
        emit("click", item);
    }
</script>
