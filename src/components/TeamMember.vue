<template>
    <div class="ma-1 d-flex align-start">
        <v-hover>
            <template v-slot:default="{ isHovering, props }">
                <v-card v-bind="props" :color="app.isSelected(data) ? 'primary' : (isHovering ? 'secondary' : undefined)" rounded="circle" class="pa-2">
                    <v-avatar
                        size="60"
                        :image="data ? getSrc(data.official_name) : placeholder"
                        @click="selectHero"/>
                </v-card>
            </template>
        </v-hover>
        <div class="mt-2 ml-4">
            <div class="text-caption">{{ text }}</div>
            <div class="d-flex">
                <v-img v-if="data"
                    :src="attrIcon(data.attribute)"
                    width="20" max-width="20"
                    class="mr-1"/>
                {{ data ? data.official_name : "<blank>" }}
            </div>
            <v-btn v-if="selected && (!data || selected.hero_id !== data.hero_id)"
                size="small"
                icon="mdi-swap-horizontal"
                variant="text"
                rounded="0"
                @click="switchHero"/>
            <v-btn v-if="data"
                size="small"
                icon="mdi-delete"
                color="error"
                variant="text"
                rounded="0"
                @click="resetHero"/>
        </div>
    </div>
</template>

<script setup>
    import { useApp } from '@/store/app';
    import { storeToRefs } from 'pinia'

    const props = defineProps({
        data: {
            type: [Object, null],
            required: true,
        },
        text: {
            type: String,
            required: true
        },
        position: {
            type: Number,
            required: true
        },
        placeholder: {
            type: String,
            default: "https://cdn.vuetifyjs.com/images/parallax/material.jpg"
        },
    });

    const app = useApp();
    const { selected } = storeToRefs(app);

    function attrIcon(attribute) {
        return `images/${attribute}_attribute_symbol.png`
    }
    function getSrc(name) { return `images/heroes/${name.replaceAll(" ", "_")}_icon.png` }

    function resetHero() { app.resetPosition(props.position) }
    function switchHero() {
        app.setPositionToSelected(props.position)
    }
    function selectHero() {
        if (props.data) {
            if (app.selected && app.selected.hero_id === props.data.hero_id) {
                app.setSelected(null);
            } else {
                app.setSelected(props.data.hero_id)
            }
        } else if (app.selected) {
            app.setPositionToSelected(props.position)
        }
    }
</script>