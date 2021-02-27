<template>
  <svg id="barChart"></svg>
</template>

<script lang="ts">
import Vue from 'vue'
import * as d3 from 'd3'

interface BarChartDataType {
  label: string
  num: number
  startPos: number
}

export default Vue.extend({
  name: 'BarChart',
  props: {
    data: {
      type: Array as [BarChartDataType, BarChartDataType],
      required: true,
    },
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    drawChart() {
      const data = this.data

      const config = {
        margin: { top: 20, right: 0, bottom: 20, left: 0 },
        width: 200,
        height: 100,
        barHeight: 50,
      }
      const { margin, width, height, barHeight } = config
      const w = width - margin.left - margin.right
      const h = height - margin.top - margin.bottom
      const halfBarHeight = barHeight / 2

      const color = d3.scaleOrdinal().range(['#04c4b4', '#ff8355'])

      const total = d3.sum(data, (d: any) => d.num)

      // set up scales for horizontal placement
      const xScale = d3.scaleLinear().domain([0, total]).range([0, w])

      // create svg in passed in div
      const selection = d3
        .select('#barChart')
        .attr('width', width)
        .attr('height', height)
        .append('g')

      // stack rect for each data value
      selection
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'rect-stacked')
        .attr('x', (d: any) => xScale(d.startPos))
        .attr('y', h / 2 - halfBarHeight)
        .attr('height', barHeight)
        .attr('width', (d: any) => xScale(d.num))
        .attr('fill', function (_: any, i: any) {
          return color(i)
        })
        .style('stroke', '#fff')
        .style('stroke-width', 5)

      // add values on bar
      selection
        .selectAll('.text-value')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'text-value')
        .attr('text-anchor', 'middle')
        .attr('x', (d: any) => xScale(d.startPos) + xScale(d.num) / 2)
        .attr('y', h / 2 + 5)
        .text((d: any) => d.num)

      // add the labels
      selection
        .selectAll('.text-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'text-label')
        .attr('text-anchor', 'middle')
        .attr('x', (d: any) => xScale(d.startPos) + xScale(d.num) / 2)
        .attr('y', h / 2 + halfBarHeight * 1.1 + 20)
        .attr('fill', function (_: any, i: any) {
          return color(i)
        })
        .text((d: any) => d.label)
    },
  },
})
</script>
