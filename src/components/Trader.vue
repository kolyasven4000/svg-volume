<template>
  <div>
    hello
  </div>
</template>
<script>
export default {
  name: "Trader",
  props: {
    id: {
      type: String,
      required: true
    },
    money: {
      type: Number,
      default: 0
    },
    stocks: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ""
    },
    priceDeviation: {
      type: Number,
      default: 0
    },
    stopPercent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  created() {
    // this.createOffer();
  },
  computed: {
    ...mapGetters("exchange", ["currentPrice"]),
    maxStocksAvailable() {
      return Math.floor(this.money / this.currentPriceOffer);
    },
    currentPriceOffer() {
      return this.currentPrice - this.priceDeviationValue;
    },
    priceDeviationValue() {
      return (this.currentPrice * this.priceDeviation) / 100;
    },
    isBull() {
      return this.type === "bull";
    },
    isBear() {
      return this.type === "bear";
    }
  },
  methods: {
    ...mapActions("exchange", ["setBuyOffer", "setSellOffer"]),
    createOffer() {
      const amount = Math.floor(this.money / this.currentPriceOffer);
      if (this.isBull) {
        this.setBuyOffer({
          amount,
          payment: this.money,
          price: this.currentPriceOffer,
          id: this.id
        });
      } else {
        this.setSellOffer({
          stocks: this.stocks,
          price: this.currentPriceOffer,
          id: this.id
        });
      }
    }
  }
};
</script>
