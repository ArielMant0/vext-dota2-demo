<template>
    <div :class="['d-flex', vertical ? 'flex-column' : 'flex-row']">
        <BarComparisonChart
            attr="attribute"
            title="Attributes"
            :groups="groups"
            :group-colors="groupColors"
            :labels="attributes"
            :values="attrValues"
            :yDomain="useTeamMinMax  ? minmax : undefined"
            :previewLabels="includePreview && app.selected && !app.selectionInTeam ? [app.selected.attribute] : null"
            :previewValues="includePreview && app.selected && !app.selectionInTeam ? [{ x: app.selected.attribute, y: 1 }] : null"
            :width="width"/>
        <BarComparisonChart
            attr="roles"
            title="Roles"
            :groups="groups"
            :group-colors="groupColors"
            :labels="roles"
            :values="rolesValues"
            :yDomain="useTeamMinMax  ? minmax : undefined"
            :previewLabels="includePreview && app.selected && !app.selectionInTeam ? app.selected.roles : null"
            :previewValues="includePreview && app.selected && !app.selectionInTeam ? app.selected.roles.map(d => ({ x: d, y: 1 })) : null"
            :width="width"/>
        <BarComparisonChart
            attr="attack_type"
            title="Attack Type"
            :groups="groups"
            :group-colors="groupColors"
            :labels="attackTypes"
            :values="attackTypesValues"
            :yDomain="useTeamMinMax  ? minmax : undefined"
            :previewLabels="includePreview && app.selected && !app.selectionInTeam ? app.selected.roles : null"
            :previewValues="includePreview && app.selected && !app.selectionInTeam ? app.selected.roles.map(d => ({ x: d, y: 1 })) : null"
            :width="width"/>
        <BarComparisonChart
            attr="legs"
            title="Number of Legs"
            :groups="groups"
            :group-colors="groupColors"
            :labels="legLabels"
            :values="legValues"
            :yDomain="useTeamMinMax  ? minmax : undefined"
            :previewLabels="includePreview && app.selected && !app.selectionInTeam ? [app.selected.legs] : null"
            :previewValues="includePreview && app.selected && !app.selectionInTeam ? [{ x: app.selected.legs, y: 1 }] : null"
            :width="width"/>
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
        groupColors: {
            type: Object,
            required: true
        },
        groupAttr: {
            type: String,
            default: "team"
        },
        data: {
            type: Array,
            required: true
        },
        vertical: {
            type: Boolean,
            default: false
        },
        includePreview: {
            type: Boolean,
            default: true
        },
        useTeamMinMax: {
            type: Boolean,
            default: true
        },
        width: {
            type: Number,
            default: 400
        },
    });

    const app = useApp();
    const { attributes, roles, attackTypes } = storeToRefs(app);

    const minmax = d3.range(0, 7, 1);

    function inGroup(item, group) {
        if (Array.isArray(item[props.groupAttr])) {
            return item[props.groupAttr].includes(group)
        }
        return item[props.groupAttr] === group;
    }

    const attrValues = computed(() => {
        const asarray = [];
        props.groups.forEach(g => {
            const m = d3.group(props.data.filter(d => d && inGroup(d, g.value)), d => d.attribute);
            m.forEach((value, key) => asarray.push({ x: key, y: value.length, team: g.value }));
        })
        return asarray;
    })
    const rolesValues = computed(() => {
        const asarray = [];
        props.groups.forEach(g => {

            const allrolesA = props.data
                .filter(d => d && inGroup(d, g.value))
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
    const attackTypesValues = computed(() => {
        const asarray = [];
        props.groups.forEach(g => {
            const m = d3.group(props.data.filter(d => d && inGroup(d, g.value)), d => d.attack_type);
            m.forEach((value, key) => asarray.push({ x: key, y: value.length, team: g.value }));
        })
        return asarray;
    })

    const legValues = computed(() => {
        const asarray = [];
        props.groups.forEach(g => {
            const m = d3.group(props.data.filter(d => d && inGroup(d, g.value)), d => d.legs);
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