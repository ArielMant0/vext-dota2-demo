<template>
    <VextNoteDrawer v-model="open"/>
    <VextExtraContent/>
    <div class="d-flex flex-column align-center">
        <div class="d-flex align-center mt-4 mb-4">
            <div class="mr-2">Pick a Scenario:</div>
            <v-select v-model="scenario" :items="SCENARIO_LIST"
                item-title="name"
                density="compact"
                return-object
                hide-details
                style="max-width: 300px"/>
        </div>
        <div ref="el">
            <VextNoteCanvas :width="size.width" :height="size.height" :show-border="false"/>
            <AttributeHeroGrids :width="100" @click="onHeroClick"/>
            <TaskViewer :title="task.title" :description="task.description"/>
            <TeamViewer v-if="scenarioLoaded"/>
        </div>
    </div>
    <HeroTooltip/>
</template>

<script setup>
    import * as d3 from 'd3'
    import { ref, reactive, onMounted, watch } from 'vue'
    import { useApp } from '@/store/app'
    import { useElementSize } from '@vueuse/core';
    import { storeToRefs } from 'pinia';
    import { useVextNote, useVextSettings } from '@nullbuild/vext';
    import AttributeHeroGrids from '@/components/AttributeHeroGrids.vue'
    import TeamViewer from '@/components/TeamViewer.vue';
    import TaskViewer from '@/components/TaskViewer.vue';
    import HeroTooltip from '@/components/HeroTooltip.vue';

    const app = useApp();
    const open = ref(false);
    const task = reactive({
        title: "Task Title",
        description: "Task Description"
    });

    app.init();

    const settings = useVextSettings();
    const note = useVextNote();
    note.on("canvas:created", function() {
        note.canvas.freeDrawingCursor = "crosshair";
        settings.setBrushSize(3, false);
        settings.setColorPrimary("#cccccc", false);
    })
    settings.onAction = false;

    const el = ref(null);
    const { scenario, scenarioLoaded, SCENARIO_LIST } = storeToRefs(app);

    const size = reactive(useElementSize(el));

    function onHeroClick(data) {
        if (!app.isInEnemyTeam(data.hero)) {
            const [x, y] = d3.pointer(data.event, document.body);
            app.tX = x;
            app.tY = y;
            app.selectById(data.hero.hero_id);
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
