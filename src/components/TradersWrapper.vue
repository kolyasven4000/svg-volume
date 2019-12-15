<template>
  <div>
    <Trader
      v-for="({ money, stocks, id, type, priceDeviation, stopPercent },
      i) in tradersList"
      :key="i"
      :money="money"
      :stocks="stocks"
      :id="id"
      :type="type"
      :priceDeviation="priceDeviation"
      :stopPercent="stopPercent"
    />
  </div>
</template>
<script>
import Trader from "./Trader.vue";
export default {
  name: "TradersWrapper",
  components: {
    Trader
  },
  data() {
    return {};
  },
  created() {},
  computed: {
    ...mapGetters("traders", ["tradersList"])
  },
  methods: {}
};
</script>
