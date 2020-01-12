<template>
  <div class="graphic">
    <svg
      :height="graphicHeight"
      :width="graphicWidth"
      xmlns="http://www.w3.org/2000/svg"
      ref="graphic"
    >
      <g
        v-for="({ coords: { x1, x2, y }, price }, i) in horizontalLinesCoords"
        :key="`xAxis${i}`"
      >
        <line
          :x1="x1"
          :y1="y"
          :x2="x2"
          :y2="y"
          stroke="rgba(0,0,0)"
          stroke-dasharray="2"
          stroke-width="1"
        ></line>
        <text :x="x2 - 30" :y="y">{{ price }}</text>
      </g>
      <BarPath
        v-for="({ coords: { min, max, opening, closing, left } }, i) in barArr"
        :key="i"
        :left="left"
        :min="min"
        :max="max"
        :opening="opening"
        :closing="closing"
      />
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
      barShift: 20,
      barArr: [
        {
          min: 4,
          max: 19,
          opening: 8,
          closing: 13
        },
        {
          min: 5,
          max: 15,
          opening: 13,
          closing: 6
        }
      ]
    };
  },
  created() {
    this.initBarArrCoords();
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
        min: Math.min(...this.barArr.map(e => e.min)),
        max: Math.max(...this.barArr.map(e => e.max))
      };
    },
    horizontalLinesMargin() {
      return this.graphicHeight / (this.horizontalLinesValue - 1);
    },
    horizontalLinesCoords() {
      return new Array(this.horizontalLinesValue).fill(null).map((e, i) => {
        const topMargin = i * this.horizontalLinesMargin;
        return {
          coords: {
            x1: 0,
            y: topMargin,
            x2: this.graphicWidth
          },
          price: this.priceStepValues[i]
        };
      });
    },
    priceStep() {
      const { min, max } = this.priceExtremumValues;
      // подсчет шага с учетом добавления доп отметок над текущими экстремумами
      // чтобы свечи не прижимались к краям канваса графика
      return (max - min) / (this.horizontalLinesValue - 3);
    },
    priceStepValues() {
      const { max } = this.priceExtremumValues;

      const maxPrice = max + this.priceStep;
      return new Array(this.horizontalLinesValue).fill(null).map((e, i) => {
        return maxPrice - this.priceStep * i;
      });
    }
  },
  methods: {
    getClosestPriceObj(barPrice) {
      // Находим объект с осью, под которой будет стоят отметка цены
      const closestPriceObj = this.horizontalLinesCoords.reduce(
        (prevLineObj, curLineObj) => {
          const { price: prevLinePrice } = prevLineObj;
          const { price: curLinePrice } = curLineObj;
          return barPrice <= prevLinePrice && barPrice > curLinePrice
            ? prevLineObj
            : curLineObj;
        }
      );
      const closestPriceDifference = closestPriceObj.price - barPrice;
      // если цена соответствует значению на X оси графика
      // то возвращаем Y координату оси
      if (closestPriceDifference === 0) {
        return closestPriceObj.coords.y;
      } else {
        const priceCoefficient = closestPriceDifference / this.priceStep;
        const { y } = closestPriceObj.coords;
        return y + this.horizontalLinesMargin * priceCoefficient;
      }
    },
    initBarArrCoords() {
      this.barArr = this.barArr.map((e, i) => {
        const { min, max, opening, closing } = e;
        return {
          ...e,
          coords: {
            min: this.getClosestPriceObj(min),
            max: this.getClosestPriceObj(max),
            opening: this.getClosestPriceObj(opening),
            closing: this.getClosestPriceObj(closing),
            left: i * this.barShiftValue
          }
        };
      });
    },
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
  border: 1px solid red;
}
svg path {
  transition: 0.1s;
}
</style>
