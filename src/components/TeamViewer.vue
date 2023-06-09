<template>
    <div class="text-h5 ml-4">My Team</div>
    <div class="d-flex flex-column align-center">
        <div class="ma-2 d-flex">
            <TeamMember :data="pos1" :position="1" text="Position 1: Safelane" :placeholder="placeholder"/>
            <TeamMember :data="pos2" :position="2" text="Position 1: Midlane" :placeholder="placeholder"/>
            <TeamMember :data="pos3" :position="3" text="Position 1: Offlane" :placeholder="placeholder"/>
            <TeamMember :data="pos4" :position="4" text="Position 1: Soft Support" :placeholder="placeholder"/>
            <TeamMember :data="pos5" :position="5" text="Position 1: Hard Support" :placeholder="placeholder"/>
        </div>
        <TeamStats :data="team"/>
        <div>
            <SynergyVis :data="team"/>
            <HeroMatrix :data="heroes"/>
        </div>
    </div>
</template>

<script setup>
    import { useApp } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import TeamMember from './TeamMember.vue';
    import TeamStats from './TeamStats.vue';
    import SynergyVis from './SynergyVis.vue';
    import HeroMatrix from './HeroMatrix.vue';

    const app = useApp();
    const { pos1, pos2, pos3, pos4, pos5, team, heroes } = storeToRefs(app);

    const props = defineProps({
        placeholder: {
            type: String,
            default: "images/Dota_2_logo.png"
        },
    });

</script>