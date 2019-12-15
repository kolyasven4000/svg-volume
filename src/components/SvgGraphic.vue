<template>
  <div class="graphic">
    <svg
      :height="graphicHeight"
      :width="graphicWidth"
      xmlns="http://www.w3.org/2000/svg"
      ref="graphic"
    >
      <BarPath
        v-for="({ minPrice, maxPrice, openingPrice, closingPrice },
        i) in barArr"
        :key="i"
        :left="0"
        :minPrice="minPrice"
        :maxPrice="maxPrice"
        :openingPrice="openingPrice"
        :closingPrice="closingPrice"
      />
      <g
        v-for="({ x1, y1, x2, y2, price }, i) in horizontalLinesCoords"
        :key="i"
      >
        <line
          :x1="x1"
          :y1="y1"
          :x2="x2"
          :y2="y2"
          stroke="rgba(0,0,0,.2)"
          stroke-dasharray="2"
          stroke-width="1"
        ></line>
        <text :x="x2 - 30" :y="y2">{{ price }}</text>
      </g>
      <!-- <path
        v-for="({ barPath, fillColor }, i) in barArr"
        :key="i"
        :d="barPath"
        :fill="fillColor"
        stroke="black"
        stroke-width="1"
      ></path> -->
    </svg>
  </div>
</template>

<script>
import BarPath from "./BarPath";
import Path from "@/js/classes/path";
export default {
  name: "SvgGraphic",
  components: {
    BarPath
  },
  data() {
    return {
      graphicHeight: 215,
      graphicWidth: 400,
      horizontalLinesValue: 8,
      tick: {
        step: 500,
        timeFrame: 2000,
        filled: 0
      },
      volume: 0,
      barConfig: {
        left: 0,
        top: 150,
        width: 10
      },
      maxBarAmount: 0,
      barShift: 10,
      barArr: [
        {
          minPrice: 4,
          maxPrice: 19,
          openingPrice: 8,
          closingPrice: 13
        },
        {
          minPrice: 5,
          maxPrice: 15,
          openingPrice: 8,
          closingPrice: 13
        }
      ]
    };
  },
  created() {
    // this.initVolume();
  },
  mounted() {
    this.calculateGraphicBarAmount();
  },
  computed: {
    ...mapGetters("exchange", ["minutesFrameOffers"]),
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
      return this.barConfig.width + this.barShift;
    },
    priceExtremumValues() {
      return {
        min: Math.min(...this.barArr.map(e => e.minPrice)),
        max: Math.max(...this.barArr.map(e => e.maxPrice))
      };
    },
    horizontalLinesCoords() {
      //-2 для отрисовки первой и последней оси внутри области свг
      const linesMargin =
        (this.graphicHeight - 2) / (this.horizontalLinesValue - 1);
      return new Array(this.horizontalLinesValue).fill(null).map((e, i) => {
        const topMargin = i * linesMargin + 1;
        return {
          x1: 0,
          y1: topMargin,
          x2: this.graphicWidth,
          y2: topMargin,
          price: this.priceStepValues[i]
        };
      });
    },
    priceStepValues() {
      const { min, max } = this.priceExtremumValues;
      //подсчет шага с учетом добавления доп отметок к текущим экстремумам
      const step = (max - min) / (this.horizontalLinesValue - 3);
      const maxPrice = max + step;
      return new Array(this.horizontalLinesValue).fill(null).map((e, i) => {
        return maxPrice - step * i;
      });
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
      this.barArr.forEach(bar => bar.recalculateBarShift(this.barShiftValue));
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
  margin-top: 15px;
}
svg path {
  transition: 0.1s;
}
</style>
