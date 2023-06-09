<template>
    <svg ref="el" :width="width" :height="height"></svg>
</template>

<script setup>
    import * as d3 from 'd3';
    import { getHeroSrc } from '@/use/utils'
    import { computed, ref, onMounted, watch } from 'vue';

    const props = defineProps({
        data: {
            type: Array,
            required: true
        },
        size: {
            type: Number,
            default: 10
        },
    });

    const el = ref(null);

    const width = computed(() => props.size*(props.data.length+1));
    const height = computed(() => props.size*(props.data.length+1));

    function draw() {
        const svg = d3.select(el.value);
        svg.selectAll("*").remove();

        svg.append("defs")
            .selectAll("pattern")
            .data(props.data)
            .join("pattern")
            .attr("id", d => `image-${d.official_name.replaceAll(" ", "_")}`)
            .attr("patternUnits", "objectBoundingBox")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 1)
            .attr("height", 1)
            .append("image")
            .attr("xlink:href", d => getHeroSrc(d.official_name))
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("x", -props.size*0.7)
            .attr("y", -props.size*0.7)
            .attr("width", props.size*2.5)
            .attr("height", props.size*2.5)

        const x = d3.scaleBand()
            .domain(props.data.map(d => d.hero_id))
            .range([5, width.value-5])
            .padding(0.1)

        const y = d3.scaleBand()
            .domain(props.data.map(d => d.hero_id))
            .range([5, height.value-5])
            .padding(0.1)

        svg.append("g")
            .selectAll("rect")
            .data(props.data)
            .join("rect")
            .attr("x", d => x(d.hero_id))
            .attr("y", 5)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .attr("fill", d => `url(#image-${d.official_name.replaceAll(" ", "_")})`)

        svg.append("g")
            .selectAll("rect")
            .data(props.data)
            .join("rect")
            .attr("y", d => y(d.hero_id))
            .attr("x", 5)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .attr("fill", d => `url(#image-${d.official_name.replaceAll(" ", "_")})`)
    }

    onMounted(draw);

    watch(props, draw);
</script>