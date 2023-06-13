<template>
    <v-card v-if="open && selected" class="hero-tt" :style="{ 'top': y+'px', 'left': x+'px', 'max-width': maxWidth+'px', 'max-height': maxHeight+'px' }">
        <v-card-title>
            <div class="d-flex justify-start align-center">
                <v-btn class="mr-4" rounded="0" variant="text" icon="mdi-close" size="small" color="error" @click="open = false"/>
                {{ selected.official_name }}
                <v-img :src="getAttributeSrc(selected.attribute)"
                    width="20" max-width="20"
                    class="mr-1 ml-2"/>
            </div>
        </v-card-title>
        <v-card-text>
            <div class="d-flex flex-column">

                <div class="d-flex flex-row mb-2">
                    <v-avatar size="60" :image="getHeroSrc(selected.official_name)"/>
                    <div class="ml-4 mr-2">
                        <div class="mt-1">
                            Base STR: {{ selected.base_strength }}
                            <v-chip :color="app.colorSTR" density="compact">+{{ selected.add_strength }}</v-chip>
                        </div>
                        <div class="mt-1">
                            Base AGI: {{ selected.base_agility }}
                            <v-chip :color="app.colorAGI" density="compact">+{{ selected.add_agility }}</v-chip>
                        </div>
                        <div class="mt-1">
                            Base INT: {{ selected.base_intelligence }}
                            <v-chip :color="app.colorINT" density="compact">+{{ selected.add_intelligence }}</v-chip>
                        </div>
                    </div>
                    <div class="d-flex flex-column">
                        <div>
                            <strong>Attack Type:</strong>
                            {{ selected.attack_type }}
                        </div>
                        <div class="mt-1">
                            <strong class="mr-2">Roles:</strong>
                            <v-chip v-for="r in selected.roles" density="compact" class="mr-1">{{ r }}</v-chip>
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-column">
                    <div>
                        <strong>Attack Type:</strong>
                        {{ selected.attack_type }}
                    </div>
                    <div class="mt-1">
                        <strong class="mr-2">Roles:</strong>
                        <v-chip v-for="r in selected.roles" density="compact" class="mr-1">{{ r }}</v-chip>
                    </div>
                    <div class="mt-2">
                        <strong class="mr-2">Good against:</strong>
                        <span class="text-caption" v-for="(h, i) in selected.good_against" :key="i">{{ (i > 0 ? ', ' : '') + h }}</span>
                    </div>
                    <div class="mt-2">
                        <strong class="mr-2">Bad against:</strong>
                        <span class="text-caption" v-for="(h, i) in selected.bad_against" :key="i">{{ (i > 0 ? ', ' : '') + h }}</span>
                    </div>
                    <div class="mt-2">
                        <strong class="mr-2">Pro's:</strong>
                        <span class="text-caption">{{ selected.pros }}</span>
                    </div>
                    <div class="mt-2">
                        <strong class="mr-2">Con's:</strong>
                        <span class="text-caption">{{ selected.cons }}</span>
                    </div>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
    import { useApp } from '@/store/app';
    import { ref, watch } from 'vue';
    import { storeToRefs } from 'pinia';
    import { getAttributeSrc, getHeroSrc } from '@/use/utils'

    const props = defineProps({
        maxWidth: {
            type: Number,
            default: 600
        },
        maxHeight: {
            type: Number,
            default: 300
        }
    })

    const app = useApp();
    const { tX, tY, selected } = storeToRefs(app);

    const x = ref(0);
    const y = ref(0);
    const open = ref(false);

    function calcCoordinates() {
        x.value = tX.value + 5 + props.maxWidth >= (window.innerWidth+window.scrollX) ? tX.value - props.maxWidth - 5 : tX.value + 5;
        y.value = tY.value + 5 + props.maxHeight >= (window.innerHeight+window.scrollY) ? tY.value - props.maxHeight - 5 : tY.value + 5;
    }

    function onHeroSelect() {
        open.value = true;
    }

    watch(() => [tX.value, tY.value], calcCoordinates)
    watch(selected, onHeroSelect)
</script>

<style scoped>
.hero-tt {
    position: absolute;
    z-index: 9999;
    overflow: auto;
}
</style>