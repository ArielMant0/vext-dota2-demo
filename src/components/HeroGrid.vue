<template>
    <div class="d-flex flex-wrap justify-center">
        <v-hover v-for="item in data" :key="item.id">
        <template v-slot:default="{ isHovering, props }">
            <v-card v-bind="props"
                variant="flat"
                :color="app.isSelected(item) ? 'primary' : (isHovering ? color : undefined)">
                <v-img class="ma-1" cover
                    aspect-ratio="1.7778"
                    :width="width"
                    :max-width="width"
                    cross-origin="anonymous"
                    :src="getSrc(item.official_name)"
                    :lazy-src="placeholder"
                    @click="onClick(item)"
                    @mouseenter="mouseenter"
                    @mouseleave="mouseleave"/>
            </v-card>
        </template>
        </v-hover>
    </div>
</template>

<script setup>
import { useApp } from '@/store/app';

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
            default: "https://cdn.vuetifyjs.com/images/parallax/material.jpg"
        }
    });

    const emit = defineEmits(["click"]);

    const app = useApp();

    function onClick(item) {
        emit("click", item);
    }
    function getSrc(name) {
        return `images/heroes/${name.replaceAll(" ", "_")}_icon.png`
    }

    function mouseenter(event) {
        if (event.target) {
            event.target.style.borderColor = props.color;
        }
    }
    function mouseleave(event) {
        if (event.target) {
            event.target.style.borderColor = "white";
        }
    }
</script>
