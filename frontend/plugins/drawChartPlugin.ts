import { Plugin } from '@nuxt/types'
import * as d3 from 'd3'

declare module 'vue/types/vue' {
  interface Vue {
    $drawChart(valueMen: number, valueWomen: number): void
    $drawBarChart(numMen: number, numWomen: number, chartWidth: number, chartHeight: number): void
  }
}

const drawChartPlugin: Plugin = ({ app }, inject) => {
  const drawChart = (valueMen: number, valueWomen: number): void => {
    const data = [
      { label: app.i18n.t('women'), value: valueWomen },
      { label: app.i18n.t('men'), value: valueMen },
    ]

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
          app.i18n.t('unit.minutes') +
          (d.data.value % 60) +
          app.i18n.t('unit.seconds')
        )
      })
  }

  const drawBarChart = (numMen: number, numWomen: number, chartWidth: number, chartHeight: number): void => {
    const data = [
      { label: app.i18n.t('men'), num: numMen, startPos: 0 },
      { label: app.i18n.t('women'), num: numWomen, startPos: numMen },
    ]

    const config = {
      margin: { top: 20, right: 0, bottom: 20, left: 0 },
      width: chartWidth,
      height: chartHeight,
      barHeight: chartHeight / 2,
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
  }

  inject('drawChart', drawChart)
  inject('drawBarChart', drawBarChart)
}
export default drawChartPlugin
