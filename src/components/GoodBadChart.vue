<template>
    <div class="d-flex flex-column align-center">
        <div class="text-h6">Good & Bad</div>
        <div class="text-subtitle-2">Which heroes your team is good (right) or bad (left) against</div>
        <v-select v-model="showFilter"
            class="mt-2"
            :items="['all', 'only enemy team', 'only good against', 'only bad against']"
            density="compact"/>
        <div class="d-flex">
            <svg ref="el1" :width="width" :height="height"></svg>
            <TeamStats :data="data"
                :groups="groups"
                :group-colors="groupColors"
                group-attr="inGroup"
                vertical
                :include-preview="false"
                :use-team-minmax="false"
                :width="300"/>
        </div>
    </div>
</template>

<script setup>
    import * as d3 from 'd3';
    import { getHeroSrc } from '@/use/utils'
    import { computed, ref, onMounted, watch } from 'vue';
    import { useApp } from '@/store/app';
    import TeamStats from './TeamStats.vue';

    const props = defineProps({
        data: {
            type: Array,
            required: true
        },
        width: {
            type: Number,
            default: 300
        },
        size: {
            type: Number,
            default: 30
        },
        goodColor: {
            type: String,
            default: "#5193c9"
        },
        badColor: {
            type: String,
            default: "#c95151"
        },
    });

    const app = useApp();
    const el1 = ref(null);
    const showFilter = ref("all");

    const groups = [{ value: "good", name: "Good Against" }, { value: "bad", name: "Bad Against"}];
    const groupColors = computed(() => {
        return {
            good: props.goodColor,
            bad: props.badColor,
        }
    });

    const height = computed(() => (props.size+5) * data.value.length);

    const data = computed(() => {
        if (showFilter.value === "only enemy team") {
            return props.data.filter(d => app.isInEnemyTeam(d))
        }
        if (showFilter.value === "only good against") {
            return props.data.filter(d => d.good > 0)
        }
        if (showFilter.value === "only bad against") {
            return props.data.filter(d => d.bad > 0)
        }
        return props.data;
    })

    function draw() {
        const svg = d3.select(el1.value);
        svg.selectAll("*").remove();

        svg.append("defs")
            .selectAll("pattern")
            .data(data.value)
            .join("pattern")
            .attr("id", d => `image-${d.official_name.replaceAll(/\s|'/gi, "_")}`)
            .attr("patternUnits", "objectBoundingBox")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 1)
            .attr("height", 1)
            .append("image")
            .attr("xlink:href", d => getHeroSrc(d.official_name))
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("x", -props.size*0.6)
            .attr("y", -props.size*0.5)
            .attr("width", props.size*2)
            .attr("height", props.size*2)

        const x = d3.scaleLinear()
            .domain([0, d3.max(data.value, d => {
                switch(showFilter.value) {
                    case "all":
                    default:
                        return Math.max(d.good, d.bad)
                    case "only good against":
                        return d.good;
                    case "only bad against":
                        return d.bad;
                }
            })])
            .range([0, props.width*0.5-5-props.size])

        const y = d3.scaleBand()
            .domain(data.value.map(d => d.hero_id))
            .range([5, height.value-5])
            .padding(0.15)

        svg.append("g")
            .attr("transform", `translate(${props.width*0.5+props.size*0.5},0)`)
            .selectAll("rect")
            .data(data.value.filter(d => d.good > 0))
            .join("rect")
            .attr("x", 0)
            .attr("y", d => y(d.hero_id))
            .attr("width", d => x(d.good))
            .attr("height", y.bandwidth())
            .attr("fill", props.goodColor)
            .on("pointerenter", function(_, d) {
                app.highlightTeamBy(hero => hero.good_against.includes(d.official_name));
                d3.select(this)
                    .attr("stroke", "white")
                    .attr("stroke-width", 1)
            })
            .on("pointerleave", function() {
                app.resetTeamHighlight();
                d3.select(this).attr("stroke", "none")
            })

        svg.append("g")
            .selectAll("rect")
            .data(data.value.filter(d => d.bad > 0))
            .join("rect")
            .attr("x", d => (props.width*0.5-props.size*0.5) - x(d.bad))
            .attr("y", d => y(d.hero_id))
            .attr("width", d => x(d.bad))
            .attr("height", y.bandwidth())
            .attr("fill", props.badColor)
            .on("pointerenter", function(_, d) {
                app.highlightTeamBy(hero => hero.bad_against.includes(d.official_name));
                d3.select(this)
                    .attr("stroke", "white")
                    .attr("stroke-width", 1)
            })
            .on("pointerleave", function() {
                app.resetTeamHighlight();
                d3.select(this).attr("stroke", "none")
            })

        svg.append("g")
            .attr("transform", `translate(${props.width*0.5-props.size*0.5},0)`)
            .selectAll("rect")
            .data(data.value)
            .join("rect")
            .attr("x", 0)
            .attr("y", d => y(d.hero_id))
            .attr("width", props.size)
            .attr("height", props.size)
            .attr("fill", d => `url(#image-${d.official_name.replaceAll(/\s|'/gi, "_")})`)
            .on("pointerenter", function() {
                d3.select(this)
                    .attr("stroke", "white")
                    .attr("stroke-width", 1)
            })
            .on("pointerleave", function(_, d) {
                d3.select(this)
                    .attr("stroke", d => app.isInEnemyTeam(d) ? app.enemyColor : "none")
                    .attr("stroke-width", d => app.isInEnemyTeam(d) ? 2 : 1)
            })
            .on("click", function(event, d) {
                const [x, y] = d3.pointer(event, document.body);
                    app.tX = x;
                    app.tY = y;
                app.selectById(d.hero_id);
            })
            .attr("stroke", d => app.isInEnemyTeam(d) ? app.enemyColor : "none")
            .attr("stroke-width", d => app.isInEnemyTeam(d) ? 2 : 1)
    }

    onMounted(draw);

    watch(props, draw);
    watch(data, draw);

</script>