<template>
    <div class="d-flex">
        <BarComparisonChart
            attr="attribute"
            title="Attributes"
            :groups="groups"
            :labels="attributes"
            :values="attrValues"
            :yDomain="minmax"
            :previewLabels="app.selected && !app.selectionInTeam ? [app.selected.attribute] : null"
            :previewValues="app.selected && !app.selectionInTeam ? [{ x: app.selected.attribute, y: 1 }] : null"
            :width="400"/>
        <BarComparisonChart
            attr="roles"
            title="Roles"
            :groups="groups"
            :labels="roles"
            :values="rolesValues"
            :yDomain="minmax"
            :previewLabels="app.selected && !app.selectionInTeam ? app.selected.roles : null"
            :previewValues="app.selected && !app.selectionInTeam ? app.selected.roles.map(d => ({ x: d, y: 1 })) : null"
            :width="400"/>
        <BarComparisonChart
            attr="legs"
            title="Number of Legs"
            :groups="groups"
            :labels="legLabels"
            :values="legValues"
            :yDomain="minmax"
            :previewLabels="app.selected && !app.selectionInTeam ? [app.selected.legs] : null"
            :previewValues="app.selected && !app.selectionInTeam ? [{ x: app.selected.legs, y: 1 }] : null"
            :width="400"/>
    </div>
</template>

<script setup>
    import * as d3 from 'd3';
    import { computed } from 'vue';
    import { useApp } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import BarComparisonChart from './BarComparisonChart.vue';

    const props = defineProps({
        groups: {
            type: Array,
            required: true
        },
        data: {
            type: Array,
            required: true
        },
    });

    const app = useApp();
    const { attributes, roles } = storeToRefs(app);

    const minmax = d3.range(0, 7, 1);

    const attrValues = computed(() => {
        const asarray = [];
        props.groups.forEach(g => {
            const m = d3.group(props.data.filter(d => d && d.team===g.value), d => d.attribute);
            m.forEach((value, key) => asarray.push({ x: key, y: value.length, team: g.value }));
        })
        return asarray;
    })
    const rolesValues = computed(() => {
        const asarray = [];
        props.groups.forEach(g => {

            const allrolesA = props.data
                .filter(d => d && d.team===g.value)
                .map(d => d ? d.roles : [])
                .flat()
                .map(d => ({ value: d }));

            const mA = d3.group(allrolesA, d => d.value);
            mA.forEach((value, key) => {
                if (key !== "" && value.length > 0) {
                    asarray.push({ x: key, y: value.length, team: g.value })
                }
            });
        });
        return asarray;
    })

    const legValues = computed(() => {
        const asarray = [];
        props.groups.forEach(g => {
            const m = d3.group(props.data.filter(d => d && d.team===g.value), d => d.legs);
            m.forEach((value, key) => asarray.push({ x: key, y: value.length, team: g.value }));
        });
        return asarray;
    })
    const legLabels = computed(() => {
        const m = d3.group(legValues.value, d => d.x);
        const asarray = Array.from(m.keys());
        asarray.sort();
        return asarray;
    })

</script>