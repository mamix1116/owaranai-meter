<template>
  <div>
    <b-container>
      <h1 class="text-center">
        <router-link to="/">
          <img
            src="@/assets/images/meter_logo-middle.png"
            width="550"
            alt="発言が終わらないメーター"
          />
        </router-link>
      </h1>
      <b-row align-v="center" align-h="center" class="my-4">
        <b-col cols="8" md="5">
          <b-form-input v-model="meetingName"></b-form-input>
        </b-col>
        <span>
          の会議
        </span>
      </b-row>
      <b-row class="justify-content-md-center mb-4">
        <b-col cols="6" md="3" class="text-center">
          <div class="font-weight-bold">男性</div>
          <b-row align-v="center" align-h="center" class="mb-4">
            <b-col cols="6">
              <b-form-input
                v-model.number="number.men"
                min="0"
                type="number"
                pattern="\d*"
              ></b-form-input>
            </b-col>
            <span>
              人
            </span>
          </b-row>
          <b-avatar
            v-if="!isRunning.men"
            button
            size="84px"
            src="@/assets/images/avatar_silent.png"
            @click="startTimer('men')"
            :disabled="!inMeeting || isRunning.men"
          ></b-avatar>
          <b-avatar
            v-else
            button
            size="84px"
            src="@/assets/images/avatar_men.png"
            @click="stopTimer('men')"
            :disabled="!inMeeting || !isRunning.men"
          ></b-avatar>
          <div class="mt-4">
            {{ hours("men") }} : {{ minutes("men") | zeroPad }} :
            {{ seconds("men") | zeroPad }}
          </div>
        </b-col>
        <b-col cols="6" md="3" class="text-center">
          <div class="font-weight-bold">女性</div>
          <b-row align-v="center" align-h="center" class="mb-4">
            <b-col cols="6">
              <b-form-input
                v-model.number="number.women"
                min="0"
                type="number"
                pattern="\d*"
              ></b-form-input>
            </b-col>
            <span>
              人
            </span>
          </b-row>
          <b-avatar
            v-if="!isRunning.women"
            button
            size="84px"
            src="@/assets/images/avatar_silent.png"
            @click="startTimer('women')"
            :disabled="!inMeeting || isRunning.women"
          ></b-avatar>
          <b-avatar
            v-else
            button
            size="84px"
            src="@/assets/images/avatar_women.png"
            @click="stopTimer('women')"
            :disabled="!inMeeting || !isRunning.women"
          ></b-avatar>
          <div class="mt-4">
            {{ hours("women") }} : {{ minutes("women") | zeroPad }} :
            {{ seconds("women") | zeroPad }}
          </div>
        </b-col>
      </b-row>
      <b-row align-v="center" class="flex-column">
        <b-col cols="10" md="6" class="mb-4">
          <b-button
            v-if="!inMeeting"
            block
            variant="primary"
            @click="inMeeting = true"
          >
            会議開始
          </b-button>
          <b-button v-else block variant="info" @click="submitSave">
            会議終了
          </b-button>
        </b-col>
        <b-col cols="10" md="6">
          <b-button block variant="secondary" class="mb-4" @click="clearAll">
            リセット
          </b-button>
        </b-col>
        <b-col cols="10" md="6">
          <b-button
            v-if="isDone"
            block
            variant="outline-success"
            @click="showModal = true"
          >
            もう一度結果を見る
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-modal v-model="showModal" centered @shown="drawChart">
      <div id="result">
        <div class="px-2 py-2">
          <div class="text-center">
            <img
              src="@/assets/images/meter_logo-horizontal.png"
              width="300"
              alt="発言が終わらないメーター"
            />
          </div>
          <h2 class="my-4" style="font-size: 28px">
            {{ meetingName === "" ? "あなた" : meetingName }}の会議
          </h2>
          <b-row class="justify-content-around my-4" style="font-size: 24px">
            <b-col class="text-center">
              男性 {{ $store.state.meetingData.num_men }}人
            </b-col>
            <b-col class="text-center">
              女性 {{ $store.state.meetingData.num_women }}人
            </b-col>
          </b-row>
          <b-row class="justify-content-center my-4">
            <svg id="chart" width="220" height="220">
              <g id="inner"></g>
            </svg>
          </b-row>
          <div class="text-center" style="font-size: 20px">#owaranai</div>
        </div>
      </div>
      <template #modal-footer="{ cancel }">
        <b-button variant="light" @click="cancel()">
          CLOSE
        </b-button>
        <b-button variant="success" @click="downloadImage">
          <b-icon icon="download" aria-hidden="true"></b-icon> 画像をDL
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import api from "@/services/api";
import * as d3 from "d3";
import html2canvas from "html2canvas";

export default {
  name: "TryMeter",
  data() {
    return {
      meetingName: "",
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
    };
  },
  computed: {
    hours: function() {
      return function(gender) {
        return Math.floor(this.diffTime[gender] / 1000 / 60 / 60);
      };
    },
    minutes: function() {
      return function(gender) {
        return Math.floor(this.diffTime[gender] / 1000 / 60) % 60;
      };
    },
    seconds: function() {
      return function(gender) {
        return Math.floor(this.diffTime[gender] / 1000) % 60;
      };
    },
    duration: function() {
      return function(gender) {
        return Math.floor(this.diffTime[gender] / 1000);
      };
    }
  },
  filters: {
    // ※ String.prototype.padStart() は IEじゃ使えない
    zeroPad: function(value, num) {
      const _num = typeof num !== "undefined" ? num : 2;
      return value.toString().padStart(_num, "0");
    }
  },
  methods: {
    setSubtractStartTime(time, gender) {
      const _time = typeof time !== "undefined" ? time : 0;
      this.startTime[gender] = Math.floor(performance.now() - _time);
    },
    startTimer(gender) {
      const vm = this;
      vm.setSubtractStartTime(vm.diffTime[gender], gender);

      (function loop() {
        vm.nowTime[gender] = Math.floor(performance.now());
        vm.diffTime[gender] = vm.nowTime[gender] - vm.startTime[gender];
        vm.animateFrame[gender] = requestAnimationFrame(loop);
      })();
      vm.isRunning[gender] = true;
    },
    stopTimer(gender) {
      this.isRunning[gender] = false;
      cancelAnimationFrame(this.animateFrame[gender]);
    },
    clearAll() {
      this.inMeeting = false;
      this.isDone = false;
      this.meetingName = "";
      this.number.men = 0;
      this.number.women = 0;
      this.startTime.men = 0;
      this.startTime.women = 0;
      this.nowTime.men = 0;
      this.nowTime.women = 0;
      this.diffTime.men = 0;
      this.diffTime.women = 0;
      this.stopTimer("men");
      this.stopTimer("women");
      this.animateFrame.men = 0;
      this.animateFrame.women = 0;
    },
    submitSave() {
      api({
        method: "post",
        url: "/meetings/",
        data: {
          num_men: this.number.men,
          num_women: this.number.women,
          duration_men: this.duration("men"),
          duration_women: this.duration("women"),
          is_done: true
        }
      })
        .then(res => {
          this.$store.dispatch("setData", res.data);
          this.showModal = true;
          this.inMeeting = false;
          this.isDone = true;
        })
        .catch(e => {
          console.error(e);
        });
    },
    drawChart() {
      const data = [
        { label: "女性", value: this.$store.state.meetingData.duration_women },
        { label: "男性", value: this.$store.state.meetingData.duration_men }
      ];

      const svg = d3.select("#chart"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        radius = Math.min(width, height) / 2,
        g = d3
          .select("#inner")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      const color = d3.scaleOrdinal().range(["#ff8355", "#04c4b4"]);

      // Generate the pie
      const pie = d3
        .pie()
        .value(function(d) {
          return d.value;
        })
        .sort(null);

      // Generate the arcs
      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius);

      //Generate groups
      const arcs = g
        .selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

      //Draw arc paths
      arcs
        .append("path")
        .attr("fill", function(d, i) {
          return color(i);
        })
        .style("stroke", "#fff")
        .style("stroke-width", 5)
        .transition()
        .delay(function(d, i) {
          return i * 800;
        })
        .duration(1000)
        .attrTween("d", function(d) {
          var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
          return function(t) {
            d.endAngle = i(t);
            return arc(d);
          };
        });

      const text = d3
        .arc()
        .outerRadius(radius - 60)
        .innerRadius(radius - 60);

      arcs
        .append("text")
        .attr("fill", "black")
        .attr("transform", function(d) {
          return "translate(" + text.centroid(d) + ")";
        })
        .attr("dy", "5px")
        .attr("text-anchor", "middle")
        .text(function(d) {
          return (
            d.data.label + ":" + (Math.floor(d.data.value / 60) % 60) + "分"
          );
        });
    },
    downloadImage() {
      html2canvas(document.querySelector("#result"))
        .then(function(canvas) {
          canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.download = "owaranai-meter.png";
            a.href = url;
            a.click();
            a.remove();
            setTimeout(() => {
              URL.revokeObjectURL(url);
            }, 1e4);
          }, "image/png");
        })
        .then(() => {
          this.showModal = false;
        });
    }
  }
};
</script>
