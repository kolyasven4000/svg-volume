<template>
  <div class="graphic">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
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
class Path {
  constructor(x, y) {
    this.left = x;
    this.top = y;
    this.width = 6;
    this.volumeValue = 0;
    this.volumeTickArr = [];
    this.tailLeft = this.left + this.width / 2;
  }
  get barPath() {
    const { left, top } = this;
    return `M ${left} ${top}
              L ${left} ${this.barChangedPoint}
              L ${left + this.width} ${this.barChangedPoint}
              L ${left + this.width} ${top} Z ${this.barTopTailPath}`;
  }
  get barTopTailPath() {
    if (this.maxVolume > this.volumeValue) {
      return `M ${this.tailLeft} ${this.barChangedPoint}
              L ${this.tailLeft} ${this.barChangedPoint + this.maxVolume}
              L ${this.tailLeft + this.width} ${this.barChangedPoint +
        this.maxVolume}
              L ${this.tailLeft + this.width} ${this.barChangedPoint} Z`;
    } else {
      return "";
    }
  }
  get pathState() {
    const { left, top, barPath, volumeValue } = this;
    return { left, top, barPath, volumeValue };
  }
  get fillColor() {
    return this.volumeValue > 0 ? "green" : "red";
  }
  get barChangedPoint() {
    return this.top - this.volumeValue;
  }
  get maxVolume() {
    return Math.max(...this.volumeTickArr);
  }
  get minVolume() {
    return Math.min(...this.volumeTickArr);
  }
  setBarVolume(volume) {
    this.volumeTickArr.push(volume);
    this.volumeValue = volume;
  }
}
export default {
  name: "SvgGraphic",
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
    barYCoord() {
      return this.barConfig.top - this.volume;
    },
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
}
svg path {
  transition: 0.3s;
}
</style>
