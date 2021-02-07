<template>
  <div>
    <p>{{ totalMeetingNum }}会議</p>
    <p>{{ totalParticipants }}人</p>
    <div v-if="totalMeetingNum !== 0">
      <svg id="barChart"></svg>
      <svg id="chart" width="300" height="300">
        <g id="inner"></g>
      </svg>
    </div>
    <b-button href="/try_meter" block variant="primary">計測する</b-button>
  </div>
</template>

<script>
import api from '@/services/api'
import * as d3 from 'd3'

export default {
  name: 'Total',
  data() {
    return {
      totalMeetingNum: 0,
      totalParticipants: 0,
      sumDurationMen: 0,
      sumDurationWomen: 0,
      sumNumberMen: 0,
      sumNumberWomen: 0
    }
  },
  mounted() {
    this.getDataAndDrawChart();
  },
  methods: {
    getDataAndDrawChart() {
      api({
        method: 'get',
        url: '/meetings/'
      })
        .then((res) => {
          this.totalMeetingNum = res.data.length;
          this.sumDurationMen = res.data.reduce((prev, current) => {
            return prev + current.duration_men;
          }, 0);
          this.sumDurationWomen = res.data.reduce((prev, current) => {
            return prev + current.duration_women;
          }, 0);
          this.sumNumberMen = res.data.reduce((prev, current) => {
            return prev + current.num_men;
          }, 0);
          this.sumNumberWomen = res.data.reduce((prev, current) => {
            return prev + current.num_women;
          }, 0);
          this.totalParticipants = this.sumNumberMen + this.sumNumberWomen;
        })
        .then(() => {
          this.drawChart();
          this.drawBarChart();
        })
        .catch((e) => {
          console.error(e);
        })
    },
    drawChart() {
      const data = [
        { label: 'men', value: this.sumDurationMen },
        { label: 'women', value: this.sumDurationWomen }
      ];

      const svg = d3.select("#chart"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        radius = Math.min(width, height) / 2,
        g = d3.select("#inner").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      const color = d3.scaleOrdinal()
        .range(["#04c4b4", "#ff8355"]);

      // Generate the pie
      const pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);

      // Generate the arcs
      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      //Generate groups
      const arcs = g.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc")

      //Draw arc paths
      arcs.append("path")
        .attr("fill", function(d, i) {
          return color(i);
        })
        .transition().delay(function(d, i) { return i * 800; }).duration(1000)
        .attrTween('d', function(d) {
          var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
          return function(t) {
            d.endAngle = i(t);
            return arc(d);
          }
        });

      const text = d3.arc()
        .outerRadius(radius - 60)
        .innerRadius(radius - 60);

      arcs.append("text")
        .attr("fill", "black")
        .attr("transform", function(d) { return "translate(" + text.centroid(d) + ")"; })
        .attr("dy", "5px")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.data.label; });
    },
    drawBarChart() {
      const data = [
        { label: 'men', num: this.sumNumberMen, startPos: 0 },
        { label: 'women', num: this.sumNumberWomen, startPos: this.sumNumberMen }
      ];

      const config = {
        margin: {top: 20, right: 0, bottom: 20, left: 0},
        width: 300,
        height: 100,
        barHeight: 50
      }
      const { margin, width, height, barHeight } = config
      const w = width - margin.left - margin.right
      const h = height - margin.top - margin.bottom
      const halfBarHeight = barHeight / 2

      const color = d3.scaleOrdinal()
        .range(["#04c4b4", "#ff8355"]);

      const total = d3.sum(data, d => d.num)

      // set up scales for horizontal placement
      const xScale = d3.scaleLinear()
        .domain([0, total])
        .range([0, w])

      // create svg in passed in div
      const selection = d3.select("#barChart")
        .attr('width', width)
        .attr('height', height)
        .append('g')

      // stack rect for each data value
      selection.selectAll('rect')
        .data(data)
        .enter().append('rect')
        .attr('class', 'rect-stacked')
        .attr('x', d => xScale(d.startPos))
        .attr('y', h / 2 - halfBarHeight)
        .attr('height', barHeight)
        .attr('width', d => xScale(d.num))
        .attr("fill", function(d, i) {
          return color(i);
        })

      // add values on bar
      selection.selectAll('.text-value')
        .data(data)
        .enter().append('text')
        .attr('class', 'text-value')
        .attr('text-anchor', 'middle')
        .attr('x', d => xScale(d.startPos) + (xScale(d.num) / 2))
        .attr('y', (h / 2) + 5)
        .text(d => d.num)

      // add the labels
      selection.selectAll('.text-label')
        .data(data)
        .enter().append('text')
        .attr('class', 'text-label')
        .attr('text-anchor', 'middle')
        .attr('x', d => xScale(d.startPos) + (xScale(d.num) / 2))
        .attr('y', (h / 2) + (halfBarHeight * 1.1) + 20)
        .attr("fill", function(d, i) {
          return color(i);
        })
        .text(d => d.label)
    }
  }
}
</script>
