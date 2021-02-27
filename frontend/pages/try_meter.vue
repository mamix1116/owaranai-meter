<template>
  <div>
    <b-container>
      <h1 class="text-center">
        <nuxt-link :to="localePath('/')">
          <img
            src="@/assets/images/meter_logo-middle.png"
            width="550"
            :alt="$t('title')"
          />
        </nuxt-link>
      </h1>
      <b-row align-v="center" align-h="center" class="my-4">
        <b-col cols="8" md="5">
          <b-form-input v-model="meetingName"></b-form-input>
        </b-col>
        <span>
          {{ $t('meeting_of') }}
        </span>
      </b-row>
      <b-row class="justify-content-md-center mb-4">
        <b-col cols="6" md="3" class="text-center">
          <div class="font-weight-bold">{{ $t('men') }}</div>
          <b-row align-v="center" align-h="center" class="mb-4">
            <b-col cols="6">
              <b-form-input
                v-model.number="number.men"
                min="0"
                max="500"
                type="number"
                pattern="\d*"
              ></b-form-input>
            </b-col>
            <span>
              {{ $t('unit.people') }}
            </span>
          </b-row>
          <b-avatar
            v-if="!isRunning.men"
            button
            size="84px"
            src="@/assets/images/avatar_silent.png"
            class="avatarButton"
            :disabled="!inMeeting || isRunning.men || number.men === 0"
            @click="startTimer('men')"
          ></b-avatar>
          <b-avatar
            v-else
            button
            size="84px"
            src="@/assets/images/avatar_men.png"
            class="avatarButton"
            :disabled="!inMeeting || !isRunning.men || number.men === 0"
            @click="stopTimer('men')"
          ></b-avatar>
          <div class="mt-4">
            {{ hours('men') }} : {{ minutes('men') | zeroPad }} :
            {{ seconds('men') | zeroPad }}
          </div>
        </b-col>
        <b-col cols="6" md="3" class="text-center">
          <div class="font-weight-bold">{{ $t('women') }}</div>
          <b-row align-v="center" align-h="center" class="mb-4">
            <b-col cols="6">
              <b-form-input
                v-model.number="number.women"
                min="0"
                max="500"
                type="number"
                pattern="\d*"
              ></b-form-input>
            </b-col>
            <span>
              {{ $t('unit.people') }}
            </span>
          </b-row>
          <b-avatar
            v-if="!isRunning.women"
            button
            size="84px"
            src="@/assets/images/avatar_silent.png"
            class="avatarButton"
            :disabled="!inMeeting || isRunning.women || number.women === 0"
            @click="startTimer('women')"
          ></b-avatar>
          <b-avatar
            v-else
            button
            size="84px"
            src="@/assets/images/avatar_women.png"
            class="avatarButton"
            :disabled="!inMeeting || !isRunning.women || number.women === 0"
            @click="stopTimer('women')"
          ></b-avatar>
          <div class="mt-4">
            {{ hours('women') }} : {{ minutes('women') | zeroPad }} :
            {{ seconds('women') | zeroPad }}
          </div>
        </b-col>
      </b-row>
      <b-row align-v="center" class="flex-column">
        <b-col cols="10" md="6">
          <b-alert
            class="mb-4"
            :show="showAlert"
            dismissible
            variant="danger"
            @dismissed="dismissed"
          >
            {{ $t('alert_number') }}
          </b-alert>
        </b-col>
        <b-col cols="10" md="6" class="mb-4">
          <b-button
            v-if="!inMeeting"
            block
            variant="primary"
            @click="inMeeting = true"
          >
            {{ $t('button.start_meeting') }}
          </b-button>
          <b-button v-else block variant="info" @click="validateMeeting">
            {{ $t('button.stop_meeting') }}
          </b-button>
        </b-col>
        <b-col cols="10" md="6">
          <b-button block variant="secondary" class="mb-4" @click="clearAll">
            {{ $t('button.reset_meeting') }}
          </b-button>
        </b-col>
        <b-col cols="10" md="6">
          <b-button
            v-if="isDone"
            block
            variant="outline-success"
            @click="showModal = true"
          >
            {{ $t('button.show_result_again') }}
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-modal
      v-model="showModal"
      centered
      @shown="drawResultChart"
      @close="close"
    >
      <div ref="result">
        <b-row class="px-2 py-2">
          <b-col>
            <div class="text-center">
              <img
                src="@/assets/images/meter_logo-horizontal.png"
                width="300"
                :alt="$t('title')"
              />
            </div>
            <h2 class="text-center my-4" style="font-size: 28px">
              {{
                meetingName === ''
                  ? $t('your_meeting')
                  : meetingName + $t('meeting_of')
              }}
            </h2>
            <dl>
              <dt>
                {{ $t('result_composition') }}
              </dt>
              <dd>
                <div class="text-center">
                  <svg id="barChart"></svg>
                </div>
              </dd>
            </dl>
            <div class="text-center" style="font-size: 20px">#owaranai</div>
          </b-col>
          <b-col>
            <b-row class="justify-content-center my-4">
              <CircleChart :data="circleChartData" />
            </b-row>
          </b-col>
        </b-row>
      </div>
      <template #modal-footer>
        <b-button variant="light" @click="close">
          {{ $t('button.close') }}
        </b-button>
        <b-button variant="success" @click="downloadImage">
          <b-icon icon="download" aria-hidden="true"></b-icon>
          {{ $t('button.download') }}
        </b-button>
        <b-overlay
          :show="busy"
          rounded
          opacity="0.6"
          spinner-small
          spinner-variant="info"
          class="d-inline-block"
          @hidden="onHidden"
        >
          <b-button
            ref="button"
            :disabled="busy"
            variant="info"
            @click="submitSave"
          >
            <b-icon icon="pie-chart" aria-hidden="true"></b-icon>
            {{ $t('button.send_data') }}
          </b-button>
        </b-overlay>
      </template>
    </b-modal>
    <b-modal v-model="showCompletedModal" centered>
      <h2 style="font-size: 22px">{{ $t('title_completed') }}</h2>
      <p>{{ $t('reflected_total') }}</p>
      <template #modal-footer="{ cancel }">
        <b-button variant="light" @click="cancel()">
          {{ $t('button.close') }}
        </b-button>
        <b-button variant="success" :to="localePath('/')">
          {{ $t('button.go_total_result') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as d3 from 'd3'
import html2canvas from 'html2canvas'

interface GenderNumber {
  [key: string]: number
  men: number
  women: number
}

interface GenderBoolean {
  [key: string]: boolean
  men: boolean
  women: boolean
}

export default Vue.extend({
  filters: {
    // ※ String.prototype.padStart() は IEじゃ使えない
    zeroPad(value: number, num: number) {
      const _num = typeof num !== 'undefined' ? num : 2
      return value.toString().padStart(_num, '0')
    },
  },
  data(): {
    meetingName: string
    number: GenderNumber
    animateFrame: GenderNumber
    nowTime: GenderNumber
    diffTime: GenderNumber
    startTime: GenderNumber
    isRunning: GenderBoolean
    inMeeting: boolean
    isDone: boolean
    showModal: boolean
    showAlert: boolean
    busy: boolean
    showCompletedModal: boolean
  } {
    return {
      meetingName: '',
      number: {
        men: 0,
        women: 0,
      },
      animateFrame: {
        men: 0,
        women: 0,
      },
      nowTime: {
        men: 0,
        women: 0,
      },
      diffTime: {
        men: 0,
        women: 0,
      },
      startTime: {
        men: 0,
        women: 0,
      },
      isRunning: {
        men: false,
        women: false,
      },
      inMeeting: false,
      isDone: false,
      showModal: false,
      showAlert: false,
      busy: false,
      showCompletedModal: false,
    }
  },
  computed: {
    hours() {
      const vm = this
      return function (gender: string) {
        return Math.floor(vm.diffTime[gender] / 1000 / 60 / 60)
      }
    },
    minutes() {
      const vm = this
      return function (gender: string) {
        return Math.floor(vm.diffTime[gender] / 1000 / 60) % 60
      }
    },
    seconds() {
      const vm = this
      return function (gender: string) {
        return Math.floor(vm.diffTime[gender] / 1000) % 60
      }
    },
    duration() {
      const vm = this
      return function (gender: string) {
        return Math.floor(vm.diffTime[gender] / 1000)
      }
    },
    circleChartData() {
      return [
        { label: this.$t('women'), value: this.duration('women') },
        { label: this.$t('men'), value: this.duration('men') },
      ]
    },
  },
  watch: {
    'number.men'(newVal) {
      if (newVal === 0) {
        this.stopTimer('men')
      }
    },
    'number.women'(newVal) {
      if (newVal === 0) {
        this.stopTimer('women')
      }
    },
  },
  methods: {
    setSubtractStartTime(time: number, gender: string) {
      const _time = typeof time !== 'undefined' ? time : 0
      this.startTime[gender] = Math.floor(performance.now() - _time)
    },
    startTimer(gender: string) {
      const vm = this
      vm.setSubtractStartTime(vm.diffTime[gender], gender)
      ;(function loop() {
        vm.nowTime[gender] = Math.floor(performance.now())
        vm.diffTime[gender] = vm.nowTime[gender] - vm.startTime[gender]
        vm.animateFrame[gender] = requestAnimationFrame(loop)
      })()
      vm.isRunning[gender] = true

      switch (gender) {
        case 'men':
          this.stopTimer('women')
          break
        case 'women':
          this.stopTimer('men')
          break
      }
    },
    stopTimer(gender: string) {
      this.isRunning[gender] = false
      cancelAnimationFrame(this.animateFrame[gender])
    },
    clearAll() {
      this.showAlert = false
      this.inMeeting = false
      this.isDone = false
      this.meetingName = ''
      this.meetingName = ''
      this.number.men = 0
      this.number.women = 0
      this.startTime.men = 0
      this.startTime.women = 0
      this.nowTime.men = 0
      this.nowTime.women = 0
      this.diffTime.men = 0
      this.diffTime.women = 0
      this.stopTimer('men')
      this.stopTimer('women')
      this.animateFrame.men = 0
      this.animateFrame.women = 0
    },
    validateMeeting() {
      this.stopTimer('men')
      this.stopTimer('women')
      if (
        this.number.men > 500 ||
        this.number.men < 0 ||
        this.number.women > 500 ||
        this.number.women < 0 ||
        (this.number.men === 0 && this.number.women === 0)
      ) {
        this.showAlert = true
      } else {
        this.showModal = true
      }
    },
    dismissed() {
      this.number.men = 0
      this.number.women = 0
      this.showAlert = false
    },
    submitSave() {
      this.busy = true

      this.$axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/v1/meetings/',
        data: {
          num_men: this.number.men,
          num_women: this.number.women,
          duration_men: this.duration('men'),
          duration_women: this.duration('women'),
          is_done: true,
          locale: this.$i18n.locale,
        },
      })
        .then(() => {
          this.showModal = false
          this.inMeeting = false
          this.isDone = true
          this.busy = false
          this.showCompletedModal = true
        })
        .catch((e) => {
          console.error(e)
        })
    },
    onHidden() {
      const element = this.$refs.button as HTMLElement
      element.focus()
    },
    close() {
      this.showModal = false
      this.inMeeting = false
      this.isDone = true
    },
    drawResultChart() {
      // this.drawChart()
      this.drawBarChart()
    },
    drawBarChart() {
      const data = [
        { label: this.$t('men'), num: this.number.men, startPos: 0 },
        {
          label: this.$t('women'),
          num: this.number.women,
          startPos: this.number.men,
        },
      ]

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
    downloadImage() {
      html2canvas(this.$refs.result as HTMLElement).then(function (canvas) {
        canvas.toBlob(function (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.download = 'owaranai-meter.png'
          a.href = url
          a.click()
          a.remove()
          setTimeout(() => {
            URL.revokeObjectURL(url)
          }, 1e4)
        }, 'image/png')
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.avatarButton {
  @include solid-button($secondary);
}
</style>
