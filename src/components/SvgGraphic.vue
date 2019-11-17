<template>
  <div class="graphic">
    <svg height="100%" xmlns="http://www.w3.org/2000/svg">
      <!-- <BarPath
        :left='left'
        :top='top'
        :width='width'
        :barVolume='barVolume'
        :tailLeft='tailLeft'
        :barPath='barPath'
      /> -->
      <path
        v-for="({ barPath, fillColor }, i) in barArr"
        :key="i"
        :d="barPath"
        :fill="fillColor"
        stroke="black"
        stroke-width="1"
      ></path>
    </svg>
  </div>
</template>

<script>
import Path from "@/js/classes/path";
export default {
  name: "SvgGraphic",
  components: {},
  data() {
    return {
      tick: {
        step: 1000,
        timeFrame: 5000,
        filled: 0
      },
      volume: 0,
      bar: null,
      barConfig: {
        left: 3,
        top: 146
      },
      barShift: 10,
      width: 4,
      barArr: []
    };
  },
  created() {
    this.initVolume();
  },
  computed: {
    currentBar() {
      return this.barArr[this.barArr.length - 1] || {};
    },
    isFirstBar() {
      return !this.barArr.length;
    }
  },
  methods: {
    initVolume() {
      this.createBar();
      setInterval(() => {
        this.volume += Math.round(Math.random()) ? 5 : -5;
        this.currentBar.setBarVolume(this.volume);
        this.checkTickFilled();
      }, this.tick.step);
    },
    checkTickFilled() {
      if (this.tick.filled === this.tick.timeFrame) {
        this.tick.filled = 0;
        this.volume = 0;
        this.createBar();
      } else {
        this.tick.filled += this.tick.step;
      }
    },
    createBar() {
      const { left, top } = this.barConfig;
      const leftShift = this.isFirstBar
        ? left
        : this.currentBar.left + this.barShift;
      const topShift = this.isFirstBar ? top : this.currentBar.barChangedPoint;
      const bar = new Path(leftShift, topShift);
      this.barArr.push(bar);
    }
  }
};
</script>

<style scoped lang="scss">
.graphic {
  height: 100%;
  width: 50%;
}
svg path {
  transition: 0.1s;
}
</style>
