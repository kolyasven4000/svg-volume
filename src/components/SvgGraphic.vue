<template>
  <div class="">
    {{ isPositive }} {{ volume }}
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <!-- <path fill="#32ea32" d="M 335.5 46.5 L 335.5 30 L 339.5 30 L 339.5 46.5 Z M 337.5 30 L 337.5 10" stroke="black" stroke-width="1"></path> -->
      <path
        :fill="fillColor"
        :d="`M 35 46 L 35 ${barYCoord} L 39 ${barYCoord} L 39 46 Z`"
        stroke="black"
        stroke-width="1"
      ></path>
    </svg>
  </div>
</template>

<script>
export default {
  name: "SvgGraphic",
  data() {
    return {
      tick: {},
      volume: 0
    };
  },
  created() {
    this.initVolume();
  },
  computed: {
    barYCoord() {
      return 46 - this.volume;
    },
    isPositive() {
      return this.volume > 0;
    },
    fillColor() {
      return this.isPositive ? "green" : "red";
    }
  },
  methods: {
    initVolume() {
      setInterval(() => {
        this.volume += Math.round(Math.random()) ? 10 : -10;
      }, 1500);
    }
  }
};
</script>

<style scoped lang="scss">
svg path {
  transition: 0.3s;
}
</style>
