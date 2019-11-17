<template>
  <div class="graphic">
    <svg height="100%" xmlns="http://www.w3.org/2000/svg">
      <path
        v-for="({ barPath, fillColor, barChangedPoint }, i) in barArr"
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
    this.width = 8;
    this.volumeValue = 0;
    this.volumeTickArr = [];
    this.tailLeft = this.left + this.width / 2;
  }
  get barPath() {
    const { left, top } = this;
    return `M ${left} ${top}
              L ${left} ${this.barChangedPoint}
              L ${left + this.width} ${this.barChangedPoint}
              L ${left + this.width} ${top} Z ${this.barTopTailPath} ${
      this.barBottomTailPath
    }`;
  }
  get barTopTailPath() {
    const topTail = this.top - this.maxVolume;
    const boundTail = Math.min(this.top, this.barChangedPoint);
    return this.getBarTailTemplate(boundTail, topTail);
  }
  get barBottomTailPath() {
    const botTail = this.top - this.minVolume;
    const boundTail = Math.max(this.top, this.barChangedPoint);
    return this.getBarTailTemplate(boundTail, botTail);
  }
  get isPositiveBar() {
    return this.volumeValue >= 0;
  }
  get pathState() {
    const { left, top, barPath, volumeValue } = this;
    return { left, top, barPath, volumeValue };
  }
  get fillColor() {
    return this.isPositiveBar ? "green" : "red";
  }
  get barChangedPoint() {
    return this.top - this.volumeValue;
  }
  get maxVolume() {
    return Math.max(0, ...this.volumeTickArr);
  }
  get minVolume() {
    return Math.min(0, ...this.volumeTickArr);
  }
  getBarTailTemplate(boundCoord, extremumCoord) {
    return `M ${this.tailLeft} ${boundCoord}
              L ${this.tailLeft} ${extremumCoord}
              L ${this.tailLeft} ${extremumCoord}
              L ${this.tailLeft} ${boundCoord} Z`;
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
        timeFrame: 500000,
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
      const arr = [-5, 5, 5, -5, -5, 5, 5, -10, 100];
      let i = 0;
      setInterval(() => {
        if (i < arr.length) {
          this.volume += arr[i]; //Math.round(Math.random()) ? 5 : -5;
          this.currentBar.setBarVolume(this.volume);
          this.checkTickFilled();
          i++;
        }
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
