<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="12" md="8">
        <h1>
          <img
            src="@/assets/images/meter_logo-large.png"
            :alt="$t('title')"
          />
        </h1>
        <div class="text-center">#owaranai</div>
        <div class="text-center">
          <a
            href="https://twitter.com/share?url=https://owaranai.tokyo&hashtags=owaranai&text=発言が終わらないメーター"
            rel="nofollow"
            target="_blank"
          >
            <b-icon icon="twitter" aria-hidden="true"></b-icon>
            {{ $t('tweet') }}
          </a>
        </div>
      </b-col>
    </b-row>
    <div class="text-center my-4 py-2">
      <p class="lead">{{ $t('lead') }}</p>
      <p>{{ $t('lead_sub') }}</p>
    </div>
    <h2 class="my-4">{{ $t('title_result') }}</h2>
    <b-row>
      <b-col cols="12" md="6" class="my-4">
        <div v-if="totalMeetingNum !== 0" class="text-center">
          <svg id="chart" width="280" height="280">
            <g id="inner"></g>
          </svg>
        </div>
      </b-col>
      <b-col cols="12" md="6" class="my-4">
        <dl>
          <dt>{{ $t('result_total') }}</dt>
          <dd class="totalNumberText">
            {{ totalMeetingNum + $t('unit.meeting') }}
          </dd>
          <dt>{{ $t('result_people') }}</dt>
          <dd class="totalNumberText">
            {{ totalParticipants + $t('unit.people') }}
          </dd>
          <dt>{{ $t('result_composition') }}</dt>
          <dd>
            <div v-if="totalMeetingNum !== 0" class="text-center">
              <svg id="barChart"></svg>
            </div>
          </dd>
        </dl>
      </b-col>
    </b-row>
    <hr />
    <div class="my-4">
      <h2 class="text-center">{{ $t('title_meter') }}</h2>
      <p>{{ $t('request_for_measurement') }}</p>
      <b-row align-h="center">
        <b-col cols="12" md="6">
          <p style="font-size: 14px">{{ $t('consent_to_send_to_server') }}</p>
          <b-button
            to="/try_meter"
            pill
            block
            variant="primary"
            size="lg"
            class="buttonToNextPage"
          >
            {{ $t('button.measure') }}
          </b-button>
        </b-col>
      </b-row>
      <b-row align-h="center" class="my-4 py-4">
        <b-col cols="12" md="8">
          <img
            :src="require(`@/assets/images/${imgSrc}`)"
            :alt="$t('how_to_use')"
          />
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import * as d3 from 'd3'
import { Meeting } from '@/types/component-interfaces/api'

export default Vue.extend({
  data(): {
    totalMeetingNum: number;
    totalParticipants: number;
    sumDurationMen: number;
    sumDurationWomen: number;
    sumNumberMen: number;
    sumNumberWomen: number;
  } {
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
    this.getDataAndDrawChart()
  },
  computed: {
    imgSrc() {
      switch (this.$i18n.locale) {
        case 'ko':
          return 'torisetsu-ko.png'
        default:
          return 'torisetsu.png'
      }
    }
  },
  methods: {
    getDataAndDrawChart() {
      this.$axios.$get('http://127.0.0.1:8000/api/v1/meetings/')
        .then((res: Meeting[]) => {
          this.totalMeetingNum = res.length
          this.sumDurationMen = res.reduce((prev, current) => {
            return prev + current.duration_men
          }, 0)
          this.sumDurationWomen = res.reduce((prev, current) => {
            return prev + current.duration_women
          }, 0)
          this.sumNumberMen = res.reduce((prev, current) => {
            return prev + current.num_men
          }, 0)
          this.sumNumberWomen = res.reduce((prev, current) => {
            return prev + current.num_women
          }, 0)
          this.totalParticipants = this.sumNumberMen + this.sumNumberWomen
        })
        .then(() => {
          this.drawChart()
          this.drawBarChart()
        })
        .catch(e => {
          console.error(e)
        })
    },
    drawChart() {
      const data = [
        { label: this.$t('women'), value: this.sumDurationWomen },
        { label: this.$t('men'), value: this.sumDurationMen }
      ]

      const svg = d3.select('#chart'),
        width = svg.attr('width'),
        height = svg.attr('height'),
        radius = Math.min(width, height) / 2,
        g = d3
          .select('#inner')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

      const color = d3.scaleOrdinal().range(['#ff8355', '#04c4b4'])

      // Generate the pie
      const pie = d3
        .pie()
        .value(function(d: any) {
          return d.value
        })
        .sort(null)

      // Generate the arcs
      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius)

      //Generate groups
      const arcs = g
        .selectAll('arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc')

      //Draw arc paths
      arcs
        .append('path')
        .attr('fill', function(d: any, i: any) {
          return color(i)
        })
        .style('stroke', '#fff')
        .style('stroke-width', 5)
        .transition()
        .delay(function(d: any, i: any) {
          return i * 800
        })
        .duration(1000)
        .attrTween('d', function(d: any) {
          const i = d3.interpolate(d.startAngle + 0.1, d.endAngle)
          return function(t: any) {
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
        .attr('transform', function(d: any) {
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
    drawBarChart() {
      const data = [
        { label: this.$t('men'), num: this.sumNumberMen, startPos: 0 },
        {
          label: this.$t('women'),
          num: this.sumNumberWomen,
          startPos: this.sumNumberMen
        }
      ]

      const config = {
        margin: { top: 20, right: 0, bottom: 20, left: 0 },
        width: 300,
        height: 150,
        barHeight: 75
      }
      const { margin, width, height, barHeight } = config
      const w = width - margin.left - margin.right
      const h = height - margin.top - margin.bottom
      const halfBarHeight = barHeight / 2

      const color = d3.scaleOrdinal().range(['#04c4b4', '#ff8355'])

      const total = d3.sum(data, (d: any) => d.num)

      // set up scales for horizontal placement
      const xScale = d3
        .scaleLinear()
        .domain([0, total])
        .range([0, w])

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
        .attr('fill', function(d: any, i: any) {
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
        .attr('fill', function(d: any, i: any) {
          return color(i)
        })
        .text((d: any) => d.label)
    }
  }
})
</script>

<style lang="scss" scoped>
.totalNumberText {
  font-size: 28px;
}
.buttonToNextPage {
  @include solid-button($primary);
}
</style>
