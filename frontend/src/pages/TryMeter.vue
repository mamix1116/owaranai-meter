<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <b-form-input v-model="meetingName"></b-form-input>
        </b-col>
        <b-col>
          の会議
        </b-col>
      </b-row>
      <b-row class="mb-4">
        <b-col>
          <b-row>
            <b-col>
              <b-form-input v-model.number="number.men" min="0" type="number"></b-form-input>
            </b-col>
            <b-col>
              人
            </b-col>
          </b-row>
          <p>
            {{ hours('men') }} :
            {{ minutes('men') | zeroPad }} :
          {{ seconds('men') | zeroPad }}
          </p>
          <b-avatar v-if="!isRunning.men" button size="72px" @click="startTimer('men')" :disabled="!inMeeting || isRunning.men"></b-avatar>
          <b-avatar v-else button size="72px" @click="stopTimer('men')" :disabled="!inMeeting || !isRunning.men"></b-avatar>
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input v-model.number="number.women" min="0" type="number"></b-form-input>
            </b-col>
            <b-col>
              人
            </b-col>
          </b-row>
          <p>
            {{ hours('women') }} :
            {{ minutes('women') | zeroPad }} :
          {{ seconds('women') | zeroPad }}
          </p>
          <b-avatar v-if="!isRunning.women" button size="72px" @click="startTimer('women')" :disabled="!inMeeting || isRunning.women"></b-avatar>
          <b-avatar v-else button size="72px" @click="stopTimer('women')" :disabled="!inMeeting || !isRunning.women"></b-avatar>
        </b-col>
      </b-row>
      <b-button v-if="!inMeeting" block variant="primary" @click="inMeeting = true">会議START</b-button>
      <b-button v-else block variant="secondary" @click="submitSave">会議STOP</b-button>
      <b-button block variant="secondary" @click="clearAll">CANCEL</b-button>
      <b-button v-if="isDone" block variant="outline-primary" @click="showModal = true">結果を見る</b-button>
    </b-container>
    <b-modal v-model="showModal" centered @shown="drawChart" @ok="downloadImage">
      <div id="result">
        <h2>{{ meetingName === '' ? 'あなた' : meetingName }}の会議</h2>
        <b-row>
          <b-col>
            女性 {{ $store.state.meetingData.num_women }}人
          </b-col>
          <b-col>
            男性 {{ $store.state.meetingData.num_men }}人
          </b-col>
        </b-row>
        <svg id="chart" width="300" height="300">
          <g id="inner"></g>
        </svg>
      </div>
    </b-modal>
  </div>
</template>

<script>
import api from '@/services/api'
import * as d3 from 'd3'
import html2canvas from 'html2canvas'

export default {
  name: 'TryMeter',
  data() {
    return {
      meetingName: '',
      number: {
        men: 0,
        women: 0
      },
      animateFrame: {
        men: 0,
        women: 0
      },
      nowTime: {
        men: 0,
        women: 0
      },
      diffTime: {
        men: 0,
        women: 0
      },
      startTime: {
        men: 0,
        women: 0
      },
      isRunning: {
        men: false,
        women: false
      },
      inMeeting: false,
      isDone: false,
      showModal: false
    }
  },
  computed: {
    hours: function() {
      return function(gender) {
        return Math.floor(this.diffTime[gender] / 1000 / 60 / 60);
      }
    },
    minutes: function() {
      return function(gender) {
        return Math.floor(this.diffTime[gender] / 1000 / 60) % 60;
      }
    },
    seconds: function() {
      return function(gender) {
        return Math.floor(this.diffTime[gender] / 1000) % 60;
      }
    },
    duration: function() {
      return function(gender) {
        return Math.floor(this.diffTime[gender] / 1000);
      }
    }
  },
  filters: {
    // ※ String.prototype.padStart() は IEじゃ使えない
    zeroPad: function(value, num){
      const _num = typeof num !== 'undefined' ? num : 2;
      return value.toString().padStart(_num,"0");
    }
  },
  methods: {
    setSubtractStartTime(time, gender) {
      const _time = typeof time !== 'undefined' ? time : 0;
      this.startTime[gender] = Math.floor(performance.now() - _time);
    },
    startTimer(gender) {
      const vm = this;
      vm.setSubtractStartTime(vm.diffTime[gender], gender);

      (function loop(){
        vm.nowTime[gender] = Math.floor(performance.now());
        vm.diffTime[gender] = vm.nowTime[gender] - vm.startTime[gender];
        vm.animateFrame[gender] = requestAnimationFrame(loop);
      }());
      vm.isRunning[gender] = true;
    },
    stopTimer(gender) {
      this.isRunning[gender] = false;
      cancelAnimationFrame(this.animateFrame[gender]);
    },
    clearAll() {
      this.inMeeting = false;
      this.isDone = false;
      this.meetingName = '';
      this.number.men = 0;
      this.number.women = 0;
      this.startTime.men = 0;
      this.startTime.women = 0;
      this.nowTime.men = 0;
      this.nowTime.women = 0;
      this.diffTime.men = 0;
      this.diffTime.women = 0;
      this.stopTimer('men');
      this.stopTimer('women');
      this.animateFrame.men = 0;
      this.animateFrame.women = 0;
    },
    submitSave() {
      api({
        method: 'post',
        url: '/meetings/',
        data: {
          'num_men': this.number.men,
          'num_women': this.number.women,
          'duration_men': this.duration('men'),
          'duration_women': this.duration('women'),
          'is_done': true
        }
      })
        .then((res) => {
          this.$store.dispatch('setData', res.data);
          this.showModal = true;
          this.isDone = true;
        })
        .catch((e) => {
          console.error(e);
        })
    },
    drawChart() {
      const data = [
        { label: 'men', value: this.$store.state.meetingData.duration_men },
        { label: 'women', value: this.$store.state.meetingData.duration_women }
      ];

      const svg = d3.select("#chart"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        radius = Math.min(width, height) / 2,
        g = d3.select("#inner").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      const color = d3.scaleOrdinal()
        .range(["#A4243B", "#D8C99B", "#D8973C", "#BD632F", "#273E47"]);

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
        .text(function(d) { return d.data.label + ':' + Math.floor(d.data.value / 60) % 60 + '分'; });
    },
    downloadImage(){
      html2canvas(document.querySelector("#result")).then(function(canvas){
        canvas.toBlob(function(blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.download = 'owaranai-meter.png';
          a.href = url;
          a.click();
          a.remove();
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1E4);
        }, 'image/png');
      });
    }
  }
}
</script>
