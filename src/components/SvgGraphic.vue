<template>
  <div class="graphic">
    <svg
      height="100%"
      width="100px"
      xmlns="http://www.w3.org/2000/svg"
      ref="graphic"
    >
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
        step: 500,
        timeFrame: 2000,
        filled: 0
      },
      volume: 0,
      barConfig: {
        left: 0,
        top: 146,
        width: 10
      },
      maxBarAmount: 0,
      barShift: 10,
      barArr: []
    };
  },
  created() {
    this.initVolume();
  },
  mounted() {
    this.calculateGraphicBarAmount();
  },
  computed: {
    currentBar() {
      return this.barArr[this.barArr.length - 1] || {};
    },
    isFirstBar() {
      return !this.barArr.length;
    },
    isMaxBarAmountReached() {
      return this.maxBarAmount < this.barArr.length;
    },
    barShiftValue() {
      return this.barConfig.width + this.barShift
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
    calculateGraphicBarAmount() {
      const graphicWidth = this.$refs.graphic.clientWidth;
      this.maxBarAmount = graphicWidth / this.barShiftValue;
    },
    checkTickFilled() {
      if (this.tick.filled === this.tick.timeFrame) {
        this.tick.filled = 0;
        this.volume = 0;
        this.createBar();
        this.checkMaxBarAmount();
      } else {
        this.tick.filled += this.tick.step;
      }
    },
    checkMaxBarAmount() {
      if (this.isMaxBarAmountReached) this.recalculateBarsShift();
    },
    createBar() {
      const { left, top, width } = this.barConfig;
      const leftShift = this.isFirstBar
        ? left
        : this.currentBar.left + width + this.barShift;
      const topShift = this.isFirstBar ? top : this.currentBar.barChangedPoint;
      this.barArr.push(new Path(leftShift, topShift, width));
    },
    recalculateBarsShift() {
      this.barArr.forEach(bar =>
        bar.recalculateBarShift(this.barShiftValue)
      );
    }
  }
};
</script>

<style scoped lang="scss">
.graphic {
  height: 30vh;
  width: 100%;
}
svg {
  border: 1px solid;
}
svg path {
  transition: 0.1s;
}
</style>
