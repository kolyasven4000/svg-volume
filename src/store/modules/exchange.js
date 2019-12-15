const TRADE_TICK_UPDATE = 5000;
export default {
  namespaced: true,
  state: {
    stocks: {
      totalAmount: 1000000,
      price: 10,
      buyOffers: [],
      sellOffers: [],
      initialLimitOffers: {
        limit: 5,
        priceStep: 0.1
      } // необходимо поставить по 5 лимиток на покупку и продажу
    },
    minutesFrameOffers: [],
    history: [], // исполнение лимитных офферов
    volumeHistory: [], // исполнение рыночных офферов
    tradeDayDurationMs: 3600000, // продолжительность торгового дня в мс
    tradeDayActiveMs: 0
  },

  getters: {
    buyOffers: state => state.stocks.buyOffers,
    bid: state => {
      return state.stocks.buyOffers[0] || {};
    },
    sellOffers: state => state.stocks.sellOffers,
    ask: state => {
      return state.stocks.sellOffers[0] || {};
    },
    currentPrice: (state, getters) => {
      const { price: bidPrice } = getters.bid;
      const { price: askPrice } = getters.ask;
      if (bidPrice && askPrice) {
        return Math.floor(((askPrice + bidPrice) * 10) / 2) / 10; // округление до десятых
      } else {
        return state.stocks.price;
      }
    },
    volume: (state, getters) => {
      const { bid, ask, executedOffersVolume } = getters;
      const bidExecutedAmount = bid.executedAmount || 0;
      const askExecutedAmount = ask.executedAmount || 0;
      return bidExecutedAmount + askExecutedAmount + executedOffersVolume;
    },
    volumeHistory: state => state.volumeHistory,
    executedOffersVolume: state => {
      return state.history.reduce((acc, cur) => {
        return acc + cur.executedAmount;
      }, 0);
    },
    minutesFrameOffers: state => state.minutesFrameOffers
    /*groupVolumeBy: state => {
      const tickTime = 60; // 60sec
      state.volumeHistory.reduce((acc, cur) => {
        const { amount, executedTimestamp } = cur;
        if(new Date(executedTimestamp).getSeconds()) // если текущий оффер по секундам меньше чем прошлый,
          //то создать новый объект
        return cur;
      })
    }*/
  },

  mutations: {
    SET_BUY_OFFER(state, data) {
      state.stocks.buyOffers.push(data);
    },
    EXECUTE_BUY_MARKET(state, data) {
      const currentFrame =
        state.minutesFrameOffers[state.minutesFrameOffers.length - 1];
      const [ask] = state.stocks.sellOffers;
      const { amount } = data;
      if (ask && amount <= ask.stocksAmount) {
        ask.executedAmount += amount;
        ask.stocksAmount -= amount;
        data.executedTimestamp = Date.now();
        state.volumeHistory.push(data);
        if (ask.stocksAmount === 0) {
          currentFrame.executedOffers.push(state.stocks.sellOffers.shift());
        }
      } else {
        // todo сделать рассчет для заявки, покрывающий >1 лимитки
      }
    },
    SET_SELL_OFFER({ stocks }, data) {
      stocks.sellOffers.push(data);
      /*const { price } = data;
      const indexToPush = stocks.sellOffers.findIndex(e => price < e.price);
      if (indexToPush === -1) {
        stocks.sellOffers.unshift(data);
      } else {
        stocks.sellOffers.push(data);
      }*/
    },
    ADDED_TRADE_DAY_TIME(state) {
      state.tradeDayActiveMs += TRADE_TICK_UPDATE;
    },
    CHECK_STOCK_PRICE({ minutesFrameOffers }, price) {
      const currentFrame = minutesFrameOffers[minutesFrameOffers.length - 1];
      if (price < currentFrame.minPrice) {
        currentFrame.minPrice = price;
      } else if (price > currentFrame.maxPrice) {
        currentFrame.maxPrice = price;
      }
      currentFrame.closingPrice = price;
    },
    ADDED_TIMEFRAME_OBJ({ minutesFrameOffers }, currentPrice) {
      const currentFrame = minutesFrameOffers[minutesFrameOffers.length - 1];
      const timeframeObj = {
        minPrice: currentPrice,
        maxPrice: currentPrice,
        openingPrice: currentPrice,
        closingPrice: -1,
        executedOffers: []
      };
      if (currentFrame) {
        currentFrame.closingPrice = currentPrice;
      }
      minutesFrameOffers.push(timeframeObj);
    }
  },

  actions: {
    createLimitRangeOffers({ commit, dispatch, state, getters }) {
      const { limit, priceStep } = state.stocks.initialLimitOffers;
      const currentPrice = getters.currentPrice;
      for (let i = 0; i < limit; i++) {
        const iterationStepPrice = priceStep * (i + 1);
        const buyIterationPrice = currentPrice - iterationStepPrice;
        const sellIterationPrice = currentPrice + iterationStepPrice;

        commit("SET_BUY_OFFER", {
          stocksAmount: 100,
          price: buyIterationPrice,
          executedAmount: 0
        });
        commit("SET_SELL_OFFER", {
          stocksAmount: 100,
          price: sellIterationPrice,
          executedAmount: 0
        });
      }
      dispatch("updateExchange");
    },
    updateExchange({ commit, dispatch, state, getters }) {
      if (state.tradeDayActiveMs % 300000 === 0) {
        commit("ADDED_TIMEFRAME_OBJ", getters.currentPrice);
      }
      dispatch("executeBuyMarket", {
        amount: 25,
        executedTimestamp: -1
      });
      setTimeout(() => {
        commit("ADDED_TRADE_DAY_TIME");
        dispatch("updateExchange");
      }, TRADE_TICK_UPDATE);
    },
    executeBuyMarket({ commit, getters }, data) {
      commit("EXECUTE_BUY_MARKET", data);
      commit("CHECK_STOCK_PRICE", getters.currentPrice);
    },
    setBuyOffer({ commit }, data) {
      commit("SET_BUY_OFFER", data);
    },
    setSellOffer({ commit }, data) {
      commit("SET_SELL_OFFER", data);
    }
  }
};
