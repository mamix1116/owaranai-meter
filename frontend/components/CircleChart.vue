<template>
  <svg id="chart" width="220" height="220">
    <g id="inner"></g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'
import * as d3 from 'd3'

interface diffTimeType {
  label: string
  value: number
}

export default Vue.extend({
  name: 'CircleChart',
  props: {
    data: {
      type: Array as [diffTimeType, diffTimeType],
      required: true,
    },
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    drawChart() {
      const data = this.data

      const svg = d3.select('#chart')
      const width = svg.attr('width')
      const height = svg.attr('height')
      const radius = Math.min(width, height) / 2
      const g = d3
        .select('#inner')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

      const color = d3.scaleOrdinal().range(['#ff8355', '#04c4b4'])
      // Generate the pie
      const pie = d3
        .pie()
        .value(function (d: any) {
          return d.value
        })
        .sort(null)

      // Generate the arcs
      const arc = d3.arc().innerRadius(0).outerRadius(radius)

      // Generate groups
      const arcs = g
        .selectAll('arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc')

      // Draw arc paths
      arcs
        .append('path')
        .attr('fill', function (_: any, i: any) {
          return color(i)
        })
        .style('stroke', '#fff')
        .style('stroke-width', 5)
        .transition()
        .delay(function (_: any, i: any) {
          return i * 800
        })
        .duration(1000)
        .attrTween('d', function (d: any) {
          const i = d3.interpolate(d.startAngle + 0.1, d.endAngle)
          return function (t: any) {
            d.endAngle = i(t)
            return arc(d)
          }
        })

      const text = d3
        .arc()
        .outerRadius(radius - 60)
        .innerRadius(radius - 60)

      arcs
        .append('text')
        .attr('fill', 'black')
        .attr('transform', function (d: any) {
          return 'translate(' + text.centroid(d) + ')'
        })
        .attr('dy', '5px')
        .attr('text-anchor', 'middle')
        .text((d: any) => {
          return (
            d.data.label +
            ':' +
            Math.floor(d.data.value / 60) +
            this.$t('unit.minutes') +
            (d.data.value % 60) +
            this.$t('unit.seconds')
          )
        })
    },
  },
})
</script>
