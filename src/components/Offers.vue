<template>
  <div class="offers">
    PRICE:{{ currentPrice }}
    <div class="offers__wrapper offers__wrapper--sell">
      <div
        class="offers__item"
        v-for="({ stocksAmount, price }, i) in sellOffers"
        :key="i"
      >
        price: {{ price }} amount: {{ stocksAmount }}
      </div>
    </div>
    <div class="offers__wrapper-delimiter"></div>
    <div class="offers__wrapper offers__wrapper--buy">
      <div
        class="offers__item"
        v-for="({ payment, stocksAmount, price }, i) in buyOffers"
        :key="i"
      >
        price: {{ price }} amount: {{ stocksAmount }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Offers",
  data() {
    return {};
  },
  created() {},
  computed: {
    ...mapGetters("exchange", [
      "buyOffers",
      "sellOffers",
      "currentPrice",
      "volumeHistory"
    ])
  },
  methods: {
    ...mapActions("exchange", ["setBuyOffer", "setSellOffer"])
  }
};
</script>
<style scoped lang="scss">
.offers {
  display: flex;
  flex-direction: column;
  width: 280px;
  &__wrapper {
    &--sell {
      background-color: rgba(202, 44, 120, 0.1);
    }
    &--buy {
      background-color: rgba(112, 168, 0, 0.1);
    }
  }
  &__wrapper-delimiter {
    height: 20px;
    background-color: gray;
  }
}
</style>
