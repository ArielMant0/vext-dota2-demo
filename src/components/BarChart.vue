<template>
    <svg ref="el" :width="width" :height="height"></svg>
</template>

<script setup>

    import * as d3 from 'd3';
    import { ref, onMounted, watch } from 'vue';

    const el = ref(null);
    const props = defineProps({
        values: {
            type: Array,
            required: true
        },
        labels: {
            type: Array,
            required: true
        },
        previewValues: {
            type: [Array, null],
            default: null,
        },
        previewLabels: {
            type: [Array, null],
            default: null,
        },
        width: {
            type: Number,
            default: 300
        },
        height: {
            type: Number,
            default: 100
        },
    });

    function draw() {
        const svg = d3.select(el.value);
        svg.selectAll("*").remove();

        const xdomain = props.labels.slice();
        if (props.previewLabels) {
            props.previewLabels.forEach(d => {
                if (!xdomain.includes(d)) {
                    xdomain.push(d);
                }
            })
        }

        const x = d3.scaleBand()
            .domain(xdomain)
            .range([35, props.width-5])
            .padding(0.1)

        const ydomain = props.values.map(d => Object.assign({}, d));
        if (props.previewValues) {
            props.previewValues.forEach(d => {
                const item = ydomain.find(dd => dd.x === d.x);
                if (item) {
                    item.y += 1;
                } else {
                    ydomain.push(d);
                }
            })
        }

        const y = d3.scaleLinear()
            .domain([0, Math.max(1, d3.max(ydomain, d => d.y))])
            .range([props.height-25, 5])

        svg.append("g")
            .selectAll("rect")
            .data(props.values.filter(d => d.y > 0 && props.labels.includes(d.x)))
            .join("rect")
            .attr("x", d => x(d.x))
            .attr("y", d => y(d.y))
            .attr("width", x.bandwidth())
            .attr("height", d => y(0) - y(d.y))
            .attr("fill", "steelblue")

        if (props.previewValues) {
            svg.append("g")
                .selectAll("rect")
                .data(props.previewValues.filter(d => d.y > 0))
                .join("rect")
                .attr("x", d => x(d.x))
                .attr("y", d => {
                    const item = props.values.find(dd => dd.x === d.x);
                    return  y((item ? item.y : 0) + d.y);
                })
                .attr("width", x.bandwidth())
                .attr("height", d => {
                    const item = props.values.find(dd => dd.x === d.x);
                    return item ?
                        y(item.y) - y(item.y + d.y) :
                        y(0) - y(d.y);
                })
                .attr("fill", "steelblue")
                .attr("fill-opacity", 0.5)
        }

        svg.append("g")
            .attr("transform", "translate(35,0)")
            .call(d3.axisLeft(y).tickFormat(d3.format(".0s")).ticks(5))

        svg.append("g")
            .attr("transform", `translate(0,${props.height-25})`)
            .call(d3.axisBottom(x))
    }

    onMounted(draw);

    watch(props, draw);

</script>