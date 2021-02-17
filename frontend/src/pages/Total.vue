<template>
  <div>
    <b-container>
      <b-row align-h="center">
        <b-col cols="12" md="8">
          <h1>
            <img
              src="@/assets/images/meter_logo-large.png"
              alt="発言が終わらないメーター"
            />
          </h1>
          <div class="text-center">#owaranai</div>
          <div class="text-center">
            <a
              href="https://twitter.com/share?url=https://owaranai.tokyo&hashtags=owaranai&text=発言が終わらないメーター"
              rel="nofollow"
              target="_blank"
            >
              <b-icon icon="twitter" aria-hidden="true"></b-icon> Tweet
            </a>
          </div>
        </b-col>
      </b-row>
      <div class="text-center my-4 py-2">
        <p class="lead">“女性が多い会議”は本当に“時間がかかる”のか？</p>
        <p>会議中の発言時間を計測・可視化します。</p>
      </div>
      <h2 class="my-4">みんなの会議の集計結果</h2>
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
            <dt>これまでの集計</dt>
            <dd class="totalNumberText">{{ totalMeetingNum }}会議</dd>
            <dt>参加人数</dt>
            <dd class="totalNumberText">{{ totalParticipants }}人</dd>
            <dt>参加者の構成</dt>
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
        <h2 class="text-center">会議中の発言時間を計測・可視化します。</h2>
        <p>
          男性・女性それぞれのスタート、ストップを押して、会議中の発言時間を計測してください。
        </p>
        <b-row align-h="center">
          <b-col cols="12" md="6">
            <p style="font-size: 14px">
              統計情報の収集のため、計測結果をサーバに送信します。（会議名は送信されません）。計測ボタンを押すと同意したことになります。
            </p>
            <b-button
              to="/try_meter"
              pill
              block
              variant="primary"
              size="lg"
              class="buttonShadow"
            >
              計測する
            </b-button>
          </b-col>
        </b-row>
        <b-row align-h="center" class="my-4 py-4">
          <b-col cols="12" md="8">
            <img src="@/assets/images/torisetsu.png" alt="使い方" />
          </b-col>
        </b-row>
      </div>
    </b-container>
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
    this.getDataAndDrawChart()
  },
  methods: {
    getDataAndDrawChart() {
      api({
        method: 'get',
        url: '/meetings/'
      })
        .then(res => {
          this.totalMeetingNum = res.data.length
          this.sumDurationMen = res.data.reduce((prev, current) => {
            return prev + current.duration_men
          }, 0)
          this.sumDurationWomen = res.data.reduce((prev, current) => {
            return prev + current.duration_women
          }, 0)
          this.sumNumberMen = res.data.reduce((prev, current) => {
            return prev + current.num_men
          }, 0)
          this.sumNumberWomen = res.data.reduce((prev, current) => {
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
        { label: '女性', value: this.sumDurationWomen },
        { label: '男性', value: this.sumDurationMen }
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
        .value(function(d) {
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
        .attr('fill', function(d, i) {
          return color(i)
        })
        .style('stroke', '#fff')
        .style('stroke-width', 5)
        .transition()
        .delay(function(d, i) {
          return i * 800
        })
        .duration(1000)
        .attrTween('d', function(d) {
          var i = d3.interpolate(d.startAngle + 0.1, d.endAngle)
          return function(t) {
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
        .attr('transform', function(d) {
          return 'translate(' + text.centroid(d) + ')'
        })
        .attr('dy', '5px')
        .attr('text-anchor', 'middle')
        .text(function(d) {
          return (
            d.data.label +
            ':' +
            Math.floor(d.data.value / 60) +
            '分' +
            (d.data.value % 60) +
            '秒'
          )
        })
    },
    drawBarChart() {
      const data = [
        { label: '男性', num: this.sumNumberMen, startPos: 0 },
        {
          label: '女性',
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

      const total = d3.sum(data, d => d.num)

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
        .attr('x', d => xScale(d.startPos))
        .attr('y', h / 2 - halfBarHeight)
        .attr('height', barHeight)
        .attr('width', d => xScale(d.num))
        .attr('fill', function(d, i) {
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
        .attr('x', d => xScale(d.startPos) + xScale(d.num) / 2)
        .attr('y', h / 2 + 5)
        .text(d => d.num)

      // add the labels
      selection
        .selectAll('.text-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'text-label')
        .attr('text-anchor', 'middle')
        .attr('x', d => xScale(d.startPos) + xScale(d.num) / 2)
        .attr('y', h / 2 + halfBarHeight * 1.1 + 20)
        .attr('fill', function(d, i) {
          return color(i)
        })
        .text(d => d.label)
    }
  }
}
</script>

<style lang="scss" scoped>
.totalNumberText {
  font-size: 28px;
}
.buttonShadow {
  box-shadow: 0 3px 3px #aeaeae;
  &:hover {
    box-shadow: none;
  }
}
</style>
