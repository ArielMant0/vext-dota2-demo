<template>
    <div class="ma-1 d-flex align-start">
        <v-hover>
            <template v-slot:default="{ isHovering, props }">
                <v-card v-bind="props" :color="app.isSelected(data) ? 'primary' : (app.isTeamHighlighted(data) || isHovering ? 'secondary' : undefined)" rounded="circle" class="pa-2">
                    <v-avatar
                        :size="app.isTeamHighlighted(data) ? 65 : 60"
                        :image="data ? getHeroSrc(data.official_name) : placeholder"
                        @click="selectHero"/>
                </v-card>
            </template>
        </v-hover>
        <div class="mt-2 ml-4">
            <div class="text-caption">{{ text }}</div>
            <div class="d-flex">
                <v-img v-if="data"
                    :src="getAttributeSrc(data.attribute)"
                    width="20" max-width="20"
                    class="mr-1"/>
                {{ data ? data.official_name : "<blank>" }}
            </div>
            <v-btn :disabled="!selected || (data && selected.hero_id === data.hero_id)"
                size="x-small"
                rounded="0"
                variant="text"
                icon="mdi-swap-horizontal"
                @click="switchHero"/>
            <v-btn :disabled="!data"
                class="ml-1"
                size="x-small"
                rounded="0"
                variant="text"
                icon="mdi-delete"
                color="error"
                @click="resetHero"/>
        </div>
    </div>
</template>

<script setup>
    import { useApp } from '@/store/app';
    import { storeToRefs } from 'pinia'
    import { getAttributeSrc, getHeroSrc } from '@/use/utils'

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
            default: "images/Dota_2_logo.png"
        },
    });

    const app = useApp();
    const { selected, highlight } = storeToRefs(app);

    function resetHero() { app.resetPosition(props.position) }
    function switchHero() {
        app.setPositionToSelected(props.position)
    }
    function selectHero() {
        if (props.data) {
            if (app.selected && app.selected.hero_id === props.data.hero_id) {
                app.selectById(null);
            } else {
                app.selectById(props.data.hero_id)
            }
        } else if (app.selected) {
            app.setPositionToSelected(props.position)
        }
    }

</script>