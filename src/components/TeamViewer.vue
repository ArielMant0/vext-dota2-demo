<template>
    <div class="d-flex flex-column align-center mt-4">

        <div class="d-flex flex-column">
            <div :class="['d-flex', isMobile() ? 'd-row' : 'flex-column']">
                <v-chip class="text-h5 ml-4" :color="app.teamColor" rounded="0">My Team</v-chip>
                <div :class="['ma-2', 'd-flex', isMobile() ? 'flex-column' : 'flex-row']">
                    <TeamMember :data="pos1" :hover-color="app.teamColor" :position="1" text="Position 1: Safelane" :placeholder="placeholder" />
                    <TeamMember :data="pos2" :hover-color="app.teamColor" :position="2" text="Position 2: Midlane" :placeholder="placeholder" />
                    <TeamMember :data="pos3" :hover-color="app.teamColor" :position="3" text="Position 3: Offlane" :placeholder="placeholder" />
                    <TeamMember :data="pos4" :hover-color="app.teamColor" :position="4" text="Position 4: Soft Support" :placeholder="placeholder" />
                    <TeamMember :data="pos5" :hover-color="app.teamColor" :position="5" text="Position 5: Hard Support" :placeholder="placeholder" />
                </div>
            </div>

            <div :class="['d-flex', isMobile() ? 'flex-row' : 'flex-column']">
                <v-chip class="text-h5 ml-4" :color="app.enemyColor" rounded="0">Enemy Team</v-chip>
                <div :class="['ma-2', 'd-flex', isMobile() ? 'flex-column' : 'flex-row']">
                    <TeamMember :data="enemyPos1" :hover-color="app.enemyColor" disabled :position="1" text="Position 1: Safelane"
                        :placeholder="placeholder" />
                    <TeamMember :data="enemyPos2" :hover-color="app.enemyColor" disabled :position="2" text="Position 2: Midlane"
                        :placeholder="placeholder" />
                    <TeamMember :data="enemyPos3" :hover-color="app.enemyColor" disabled :position="3" text="Position 3: Offlane"
                        :placeholder="placeholder" />
                    <TeamMember :data="enemyPos4" :hover-color="app.enemyColor" disabled :position="4" text="Position 4: Soft Support"
                        :placeholder="placeholder" />
                    <TeamMember :data="enemyPos5" :hover-color="app.enemyColor" disabled :position="5" text="Position 5: Hard Support"
                        :placeholder="placeholder" />
                </div>
            </div>

            <TeamStats :data="bothTeams" :groups="teamsArray" :group-colors="teamColors" :vertical="isMobile()" :width="300"/>
        </div>

        <div class="d-flex align-start pa-2 ma-2 mt-6 mb-6 justify-space-around"
            style="min-width: 50%;overflow-y: auto;">
            <SynergyVis :data="team" />
            <GoodBadChart :data="goodBadData"/>
        </div>
    </div>
</template>

<script setup>
import { useApp } from '@/store/app';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import TeamMember from './TeamMember.vue';
import TeamStats from './TeamStats.vue';
import SynergyVis from './SynergyVis.vue';
import GoodBadChart from './GoodBadChart.vue';
import { isMobile } from '@/use/utils';

const app = useApp();
const {
    pos1, pos2, pos3, pos4, pos5,
    enemyPos1, enemyPos2, enemyPos3, enemyPos4, enemyPos5,
    team, bothTeams, TEAMS
} = storeToRefs(app);

const props = defineProps({
    placeholder: {
        type: String,
        default: "images/Dota_2_logo.png"
    },
});

const teamColors = {};
teamColors[app.TEAMS.ME] = app.teamColor;
teamColors[app.TEAMS.ENEMY] = app.enemyColor;

const teamsArray = [
    {
        name: "My Team",
        value: app.TEAMS.ME
    },{
        name: "Enemy Team",
        value: app.TEAMS.ENEMY
    },
];

const goodBadData = computed(() => {
    const map = {};
    team.value.forEach(hero => {

        if (!hero) return;

        hero.bad_against.forEach(d => {
            if (!app.isInTeamByName(d.official_name)) {
                const obj = app.getHeroByName(d)
                if (!map[obj.hero_id]) {
                    map[obj.hero_id] = Object.assign({ bad: 1, good: 0, }, obj);
                } else {
                    map[obj.hero_id].bad += 1;
                }
            }
        })

        hero.good_against.forEach(d => {
            if (!app.isInTeamByName(d)) {
                const obj = app.getHeroByName(d)
                if (!map[obj.hero_id]) {
                    map[obj.hero_id] = Object.assign({ bad: 0, good: 1, }, obj);
                } else {
                    map[obj.hero_id].good += 1;
                }
            }
        })
    })

    const asarray = Object.values(map);
    asarray.forEach(d => {
        d.inGroup = [];
        if (d.good > 0) d.inGroup.push("good")
        if (d.bad > 0) d.inGroup.push("bad")
    });
    asarray.sort((a, b) => {
        if (a.team === TEAMS.value.ENEMY && b.team !== TEAMS.value.ENEMY) {
            return -1;
        } else if (a.team !== TEAMS.value.ENEMY && b.team === TEAMS.value.ENEMY) {
            return 1;
        }
        return Math.max(b.good, b.bad) - Math.max(a.good, a.bad)
    })
    return asarray
})

</script>