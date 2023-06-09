<template>
    <AttributeHeroGrids :width="100" @click="onHeroClick"/>
    <TeamViewer/>
</template>

<script setup>
    import * as d3 from 'd3'
    import { onMounted } from 'vue'
    import { useApp } from '@/store/app'
    import AttributeHeroGrids from '@/components/AttributeHeroGrids.vue'
    import TeamViewer from '@/components/TeamViewer.vue';

    const app = useApp();

    function onHeroClick(hero) {
        app.setSelected(hero.hero_id);
    }

    onMounted(function() {
        d3.csv("all_heroes.csv")
            .then(response => {
                app.setColumns(response.columns)
                app.setHeroes(response.map(d => {
                    d.roles = d.roles.split(",").map(dd => {
                        return dd.replaceAll(/'|"|\[|\]|\s/ig, "")
                    });
                    return d;
                }))
            })
    })
</script>
