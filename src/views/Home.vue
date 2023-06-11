<template>
    <VextNoteDrawer v-model="open"/>
    <div ref="el">
        <VextNoteCanvas :width="size.width" :height="size.height" show-border/>
        <AttributeHeroGrids :width="100" @click="onHeroClick"/>
        <TeamViewer/>
    </div>
</template>

<script setup>
    import * as d3 from 'd3'
    import { ref, reactive, onMounted } from 'vue'
    import { useApp } from '@/store/app'
    import { useElementSize } from '@vueuse/core';
    import AttributeHeroGrids from '@/components/AttributeHeroGrids.vue'
    import TeamViewer from '@/components/TeamViewer.vue';

    const app = useApp();
    const open = ref(false);
    const el = ref(null);

    const size = reactive(useElementSize(el));

    function onHeroClick(hero) {
        app.selectById(hero.hero_id);
    }

    onMounted(function() {
        d3.csv("all_heroes.csv")
            .then(response => {
                app.setColumns(response.columns)
                app.setHeroes(response.map(d => {
                    d.roles = d.roles.split(",").map(dd => {
                        return dd.replaceAll(/"|\[|\]/ig, "").trim().replaceAll(/^'|'$/ig, "")
                    });
                    d.good_against = d.good_against.split(",").map(dd => {
                        return dd.replaceAll(/"|\[|\]/ig, "").trim().replaceAll(/^'|'$/ig, "")
                    });
                    d.bad_against = d.bad_against.split(",").map(dd => {
                        return dd.replaceAll(/"|\[|\]/ig, "").trim().replaceAll(/^'|'$/ig, "")
                    });
                    d.work_well_with = d.work_well_with.split(",").map(dd => {
                        return dd.replaceAll(/"|\[|\]/ig, "").trim().replaceAll(/^'|'$/ig, "")
                    });
                    return d;
                }))
            })
    })
</script>
