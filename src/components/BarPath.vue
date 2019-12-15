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
      type: Number
    },
    minPrice: {
      type: Number
    },
    maxPrice: {
      type: Number
    },
    openingPrice: {
      type: Number
    },
    closingPrice: {
      type: Number
    },
    currentPrice: {
      type: Number
    }
  },
  data() {
    return {};
  },
  computed: {
    isPositiveBar() {
      return this.openingPrice <= this.closingPrice;
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
    barPath() {
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
    },
    barBottomTailPath() {
      const botTail = this.minPrice;
      const boundTail = Math.min(this.openingPrice, this.closingPrice);
      return this.getBarTailTemplate(boundTail, botTail);
    }
  }
};
</script>
