<template>
  <path :d="barPath" :fill="fillColor" stroke="black" stroke-width="1"></path>
</template>
<script>
export default {
  name: "BarPath",
  props: {
    width: {
      type: Number,
      default: 20
    },
    left: {
      type: Number,
      default: 0
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    opening: {
      type: Number
    },
    closing: {
      type: Number
    }
  },
  data() {
    return {};
  },
  computed: {
    barPath() {
      const { opening, closing, left, width } = this;
      return `M ${left} ${opening}
              L ${left} ${closing}
              L ${left + width} ${closing}
              L ${left + width} ${opening} Z ${this.barTopTailPath} ${
        this.barBottomTailPath
      }`;
      /*return `M ${left} ${top}
                L ${left} ${this.barChangedPoint}
                L ${left + this.width} ${this.barChangedPoint}
                L ${left + this.width} ${top} Z ${this.barTopTailPath} ${
        this.barBottomTailPath
      }`;*/
    },
    barTopTailPath() {
      const topTail = this.max;
      const boundTail = Math.min(this.opening, this.closing);
      return `M ${this.tailLeftCoord} ${boundTail}
                L ${this.tailLeftCoord} ${topTail}
                L ${this.tailLeftCoord} ${topTail}
                L ${this.tailLeftCoord} ${boundTail} Z`;
    },
    barBottomTailPath() {
      const botTail = this.min;
      const boundTail = Math.max(this.opening, this.closing);
      return `M ${this.tailLeftCoord} ${boundTail}
                L ${this.tailLeftCoord} ${botTail}
                L ${this.tailLeftCoord} ${botTail}
                L ${this.tailLeftCoord} ${boundTail} Z`;
    },
    tailLeftCoord() {
      return this.left + this.width / 2;
    },
    isPositiveBar() {
      return this.opening >= this.closing;
    },
    fillColor() {
      return this.isPositiveBar ? "green" : "red";
    },
    tailLeft() {
      return this.left + this.width / 2;
    },
    differenceFromInitialPrice() {
      return this.openingPrice - this.closingPrice;
    }
  },
  methods: {
    /*barPath() {
      const { left, top } = this;
      return `M ${left} ${top}
                L ${left} ${this.closingPrice}
                L ${left + this.width} ${this.closingPrice}
                L ${left + this.width} ${top} Z`;
    },
    getBarTailTemplate(boundCoord, extremumCoord) {
      return `M ${this.tailLeft} ${boundCoord}
                L ${this.tailLeft} ${extremumCoord}
                L ${this.tailLeft} ${extremumCoord}
                L ${this.tailLeft} ${boundCoord} Z`;
    },
    barTopTailPath() {
      const topTail = this.maxPrice;
      const boundTail = Math.max(this.openingPrice, this.closingPrice);
      return this.getBarTailTemplate(boundTail, topTail);
    },*/
  }
};
</script>
