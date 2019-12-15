export default {
  namespaced: true,
  state: {
    traders: [
      {
        id: "1",
        type: "bull", // ставит на рост акций
        money: 1000,
        stocks: 10,
        averagePrice: 0, // средняя цена покупки
        priceDeviation: 2, // процент бонуса к цене (дешевле купить, дороже продать)
        lostPercentForAllSell: 40, // продать все акции если сильно просели
        averageOutLostPercents: 10, // усредняется при потере каждые 10%
        takeProfitPercents: 15, // забирает профит
        stopPercent: 2, // выставляет стопы

        activity: {
          maxDayOfferCount: 5
        },
        currentMoneyChanged(currentPrice) {
          return currentPrice - this.averagePrice;
        }
      },
      {
        id: "2",
        type: "bear",
        money: 1000,
        stocks: 10,
        averagePrice: 0,
        priceDeviation: -1,
        lostPercentForAllSell: 40,
        averageOutLostPercents: 10,
        takeProfitPercents: 15,
        stopPercent: 5,

        activity: {
          maxDayOfferCount: 5
        },
        currentMoneyChanged(currentPrice) {
          return currentPrice - this.averagePrice;
        }
      }
    ]
  },

  getters: {
    tradersList: state => state.traders
  },

  mutations: {},

  actions: {}
};
