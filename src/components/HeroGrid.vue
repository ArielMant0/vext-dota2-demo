<template>
    <div class="d-flex flex-wrap justify-center">
        <v-hover v-for="hero in data" :key="hero.id">
        <template v-slot:default="{ isHovering, props }">
            <v-card v-bind="props"
                variant="flat"
                :style="{ 'opacity': heroOpacity(hero, isHovering) }"
                :color="heroColor(hero, isHovering)">
                <v-img class="ma-1" cover
                    aspect-ratio="1.7778"
                    :width="width"
                    :max-width="width"
                    cross-origin="anonymous"
                    :src="getHeroSrc(hero.official_name)"
                    :lazy-src="placeholder"
                    :disabled="app.isInEnemyTeam(hero)"
                    @click="onClick(hero)"/>
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
            default: "images/Dota_2_logo.png"
        }
    });

    const emit = defineEmits(["click"]);

    const app = useApp();

    function onClick(hero) {
        emit("click", hero);
    }

    function heroOpacity(hero, isHovering) {
        if (!app.isAvailable(hero)) {
            return 0.5;
        }
        if (app.useHighlight && app.isHeroHighlighted(hero)) {
            return 1;
        }
        if (app.isSelected(hero)) {
            return 1;
        }
        return !app.useHighlight || isHovering ? 1 : 0.2
    }

    function heroColor(hero, isHovering) {
        if (app.isSelected(hero)) return "primary"
        if (isHovering) return "secondary"
        if (app.isInTeam(hero)) return app.teamColor
        if (app.isInEnemyTeam(hero)) return app.enemyColor
        return "default"
    }

</script>
