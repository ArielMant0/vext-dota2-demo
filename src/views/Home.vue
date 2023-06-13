<template>
    <VextNoteDrawer v-model="open"/>
    <div class="d-flex flex-column align-center">
        <v-select v-model="scenario" :items="SCENARIO_LIST"
            item-title="name"
            density="compact"
            return-object
            style="max-width: 300px"/>
        <div ref="el">
            <VextNoteCanvas :width="size.width" :height="size.height" :show-border="false"/>
            <AttributeHeroGrids :width="100" @click="onHeroClick"/>
            <TaskViewer :title="task.title" :description="task.description"/>
            <TeamViewer v-if="scenarioLoaded"/>
        </div>
    </div>
</template>

<script setup>
    import * as d3 from 'd3'
    import { ref, reactive, onMounted, watch } from 'vue'
    import { useApp } from '@/store/app'
    import { useElementSize } from '@vueuse/core';
    import { storeToRefs } from 'pinia';
    import AttributeHeroGrids from '@/components/AttributeHeroGrids.vue'
    import TeamViewer from '@/components/TeamViewer.vue';
    import TaskViewer from '@/components/TaskViewer.vue';

    const app = useApp();
    const open = ref(false);
    const task = reactive({
        title: "Task Title",
        description: "Task Description"
    });

    app.init();

    const el = ref(null);
    const { scenario, scenarioLoaded, SCENARIO_LIST } = storeToRefs(app);

    const size = reactive(useElementSize(el));

    function onHeroClick(hero) {
        if (!app.isInEnemyTeam(hero)) {
            app.selectById(hero.hero_id);
        }
    }

    function loadScenario() {
        scenarioLoaded.value = false;
        d3.json(scenario.value.path)
            .then(response => {
                task.title = response.title;
                task.description = response.description;
                app.setEnemyTeam(response.enemyTeam);
                scenarioLoaded.value = true
            })
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
                loadScenario();
            })
    })

    watch(scenario, loadScenario)
</script>
