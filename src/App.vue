<template>
  <div id="app">
    <SvgGraphic />
    <Offers />
    <TradersWrapper />
  </div>
</template>

<script>
import SvgGraphic from "./components/SvgGraphic.vue";
import Offers from "./components/Offers.vue";
import TradersWrapper from "./components/TradersWrapper.vue";
export default {
  name: "app",
  components: {
    SvgGraphic,
    Offers,
    TradersWrapper
  },
  created() {
    // this.createLimitRangeOffers();
  },
  methods: {
    ...mapActions("exchange", ["createLimitRangeOffers"])
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
html,
body {
  margin: 0;
  padding: 0;
}
</style>
