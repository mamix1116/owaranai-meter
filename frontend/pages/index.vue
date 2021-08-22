<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="12" md="8">
        <h1>
          <img
            :src="require(`@/assets/images/logo/${logoLargeSrc}`)"
            :alt="$t('title')"
          />
        </h1>
        <div class="text-center">#owaranai</div>
        <div class="text-center">
          <a
            href="https://twitter.com/share?url=https://owaranai.tokyo&hashtags=owaranai&text=発言が終わらないメーター"
            rel="nofollow noopener noreferrer"
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
            :to="localePath('/try_meter')"
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
import { Meeting } from '@/types/component-interfaces/api'

export default Vue.extend({
  data(): {
    totalMeetingNum: number
    totalParticipants: number
    sumDurationMen: number
    sumDurationWomen: number
    sumNumberMen: number
    sumNumberWomen: number
  } {
    return {
      totalMeetingNum: 0,
      totalParticipants: 0,
      sumDurationMen: 0,
      sumDurationWomen: 0,
      sumNumberMen: 0,
      sumNumberWomen: 0,
    }
  },
  computed: {
    logoLargeSrc() {
      switch (this.$i18n.locale) {
        case 'ko':
        case 'zh-tw':
        case 'en':
          return `${this.$i18n.locale}/logo-large.png`
        default:
          return 'logo-large.png'
      }
    },
    imgSrc() {
      switch (this.$i18n.locale) {
        case 'ko':
        case 'zh-tw':
        case 'en':
          return `torisetsu-${this.$i18n.locale}.png`
        default:
          return 'torisetsu.png'
      }
    },
  },
  mounted() {
    this.getDataAndDrawChart()
  },
  methods: {
    getDataAndDrawChart() {
      this.$api
        .$get('/meetings/')
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
          this.$drawChart(this.sumDurationMen, this.sumDurationWomen)
          this.$drawBarChart(this.sumNumberMen, this.sumNumberWomen, 300, 150)
        })
        .catch((e) => {
          console.error(e)
        })
    },
  },
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
