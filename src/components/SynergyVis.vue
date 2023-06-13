<template>
    <div class="d-flex flex-column align-center">
        <div class="text-h6">Synergy</div>
        <div class="text-subtitle-2">Which heroes your teams works well with</div>
        <v-switch v-model="showAll"
            :label="showAll ? 'all heros' : 'team only'"
            color="primary"
            density="compact"/>
        <svg ref="el" :width="width" :height="height"></svg>
    </div>
</template>

<script setup>

    import * as d3 from 'd3';
    import { useApp } from '@/store/app';
    import { getHeroSrc } from '@/use/utils'
    import { computed, ref, onMounted, watch } from 'vue';

    const app = useApp();
    const props = defineProps({
        data: {
            type: Array,
            required: true
        },
        size: {
            type: Number,
            default: 35
        },
    });

    const el = ref(null)
    const showAll = ref(true);
    const width = computed(() => props.size*6);
    const height = computed(() => (graph.value.nodes.length+5) * props.size);

    const filteredData = computed(() => props.data.filter(d => d !== null));
    const graph = computed(() => {
        const nodes = [];
        const links = [];
        const map = {}
        filteredData.value.forEach(d => {
            if (!map[d.official_name]) {
                nodes.push({ id: d.official_name });
            }
            d.work_well_with.forEach(dd => {
                if (showAll.value || app.isInTeamByName(dd)) {
                    if (!map[dd]) {
                        nodes.push({ id: dd });
                    }
                    links.push({ source: d.official_name, target: dd })
                }
            })
        });
        return {
            nodes: nodes,
            links: links
        }
    })

    function draw() {
        const svg = d3.select(el.value);
        svg.selectAll("*").remove();

        svg.append("defs")
            .selectAll("pattern")
            .data(graph.value.nodes)
            .join("pattern")
            .attr("id", d => `image-${d.id.replaceAll(/\s|'/gi, "_")}`)
            .attr("patternUnits", "objectBoundingBox")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 1)
            .attr("height", 1)
            .append("image")
            .attr("xlink:href", d => getHeroSrc(d.id))
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("x", -props.size*0.7)
            .attr("y", -props.size*0.7)
            .attr("width", props.size*2.5)
            .attr("height", props.size*2.5)

        const y = d3.scalePoint()
            .domain(graph.value.nodes.map(d => d.id))
            .range([props.size*0.5+5, height.value-props.size*0.5-5])

        const line = d3.line().curve(d3.curveNatural)
        const leftLinks = graph.value.links.filter(d => app.isInTeamByName(d.source) && app.isInTeamByName(d.target));

        svg.append("g")
            .selectAll("path")
            .data(leftLinks)
            .join("path")
            .attr("d", d => line([
                [width.value*0.5, y(d.source)],
                [width.value*0.5-props.size*2, y(d.source)*0.5+y(d.target)*0.5],
                [width.value*0.5, y(d.target)]
            ]))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .attr("stroke-opacity", 0.33)

        const rightLinks = graph.value.links.filter(d => !app.isInTeamByName(d.source) || !app.isInTeamByName(d.target));

        svg.append("g")
            .selectAll("path")
            .data(rightLinks)
            .join("path")
            .attr("d", d => line([
                [width.value*0.5, y(d.source)],
                [width.value*0.5+props.size*2, y(d.source)*0.5+y(d.target)*0.5],
                [width.value*0.5, y(d.target)]
            ]))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .attr("stroke-opacity", 0.33)

        svg.append("g")
            .selectAll("circle")
            .data(graph.value.nodes)
            .join("circle")
                .attr("cx", width.value*0.5)
                .attr("cy", d => y(d.id))
                .attr("r", props.size*0.5)
                .attr("fill", d => `url(#image-${d.id.replaceAll(/\s|'/gi, "_")})`)
                .attr("stroke", d => app.isInTeamByName(d.id) ? app.teamColor : (app.isInEnemyTeamByName(d.id) ? app.enemyColor : "none"))
                .attr("stroke-width", 2)
                .on("pointerenter", function(_, d) {
                    app.highlightTeamBy(hero => hero.work_well_with.includes(d.id));
                    d3.select(this)
                        .transition()
                        .duration(250)
                        .attr("r", props.size*0.5+5)
                })
                .on("pointerleave", function() {
                    app.resetTeamHighlight();
                    d3.select(this)
                        .transition()
                        .duration(250)
                        .attr("r", props.size*0.5)
                })
                .on("click", function(_, d) { app.selectByName(d.id) })
    }

    onMounted(draw);

    watch(props, draw);
    watch(showAll, draw)

</script>