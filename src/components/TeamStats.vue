<template>
    <div class="d-flex flex-column">
        <BarChart
            :labels="attributes"
            :values="attrValues"
            :previewLabels="app.selected && !app.selectionInTeam ? [app.selected.attribute] : null"
            :previewValues="app.selected && !app.selectionInTeam ? [{ x: app.selected.attribute, y: 1 }] : null"
            :width="400"/>
        <BarChart
            :labels="roles"
            :values="rolesValues"
            :previewLabels="app.selected && !app.selectionInTeam ? app.selected.roles : null"
            :previewValues="app.selected && !app.selectionInTeam ? app.selected.roles.map(d => ({ x: d, y: 1 })) : null"
            :width="400"/>
    </div>
</template>

<script setup>
    import * as d3 from 'd3';
    import { computed } from 'vue';
    import { useApp } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import BarChart from './BarChart.vue';

    const props = defineProps({
        data: {
            type: Array,
            required: true
        },
    });

    const app = useApp();
    const { attributes, roles } = storeToRefs(app);

    const attrValues = computed(() => {
        const m = d3.group(props.data, d => d ? d.attribute : "");
        const asarray = [];
        m.forEach((value, key) => {
            if (key !== "" && value.length > 0) {
                asarray.push({ x: key, y: value.length })
            }
        });
        return asarray;
    })
    const rolesValues = computed(() => {
        const allroles = props.data.map(d => d ? d.roles : [])
            .flat()
            .map(d => ({ value: d }));
        const m = d3.group(allroles, d => d.value);
        const asarray = [];
        m.forEach((value, key) => {
            if (key !== "" && value.length > 0) {
                asarray.push({ x: key, y: value.length })
            }
        });
        return asarray;
    })


</script>