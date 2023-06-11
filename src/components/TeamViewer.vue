<template>
    <div class="d-flex flex-column align-center mt-4">
        <div class="d-flex flex-column">
            <div class="text-h5 ml-4">My Team</div>
            <div class="ma-2 d-flex">
                <TeamMember :data="pos1" :position="1" text="Position 1: Safelane" :placeholder="placeholder" />
                <TeamMember :data="pos2" :position="2" text="Position 2: Midlane" :placeholder="placeholder" />
                <TeamMember :data="pos3" :position="3" text="Position 3: Offlane" :placeholder="placeholder" />
                <TeamMember :data="pos4" :position="4" text="Position 4: Soft Support" :placeholder="placeholder" />
                <TeamMember :data="pos5" :position="5" text="Position 5: Hard Support" :placeholder="placeholder" />
            </div>
        </div>

        <div class="d-flex flex-column">
            <div class="text-h5 ml-4 align-self-end">Enemy Team</div>
            <div class="ma-2 d-flex">
                <TeamMember :data="enemyPos1" disabled :position="1" text="Position 1: Safelane"
                    :placeholder="placeholder" />
                <TeamMember :data="enemyPos2" disabled :position="2" text="Position 2: Midlane"
                    :placeholder="placeholder" />
                <TeamMember :data="enemyPos3" disabled :position="3" text="Position 3: Offlane"
                    :placeholder="placeholder" />
                <TeamMember :data="enemyPos4" disabled :position="4" text="Position 4: Soft Support"
                    :placeholder="placeholder" />
                <TeamMember :data="enemyPos5" disabled :position="5" text="Position 5: Hard Support"
                    :placeholder="placeholder" />
            </div>
        </div>

        <TeamStats :data="bothTeams" :groups="teamsArray"/>
        <div class="d-flex align-start pa-2 ma-2 mt-6 mb-6 justify-space-around"
            style="min-width: 50%; max-height: 500px; overflow-y: auto;">
            <SynergyVis :data="team" />
            <GoodBadChart :data="goodBadData" />
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
                    map[obj.hero_id] = {
                        hero_id: obj.hero_id,
                        official_name: obj.official_name,
                        attribute: obj.attribute,
                        bad: 1,
                        good: 0,
                        team: obj.team
                    };
                } else {
                    map[obj.hero_id].bad += 1;
                }
            }
        })

        hero.good_against.forEach(d => {
            if (!app.isInTeamByName(d)) {
                const obj = app.getHeroByName(d)
                if (!map[obj.hero_id]) {
                    map[obj.hero_id] = {
                        hero_id: obj.hero_id,
                        official_name: obj.official_name,
                        attribute: obj.attribute,
                        good: 1,
                        bad: 0,
                        team: obj.team
                    };
                } else {
                    map[obj.hero_id].good += 1;
                }
            }
        })
    })

    const asarray = Object.values(map);
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