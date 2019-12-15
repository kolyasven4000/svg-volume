import Vue from "vue";
import Vuex from "vuex";

import traders from "./modules/traders/traders";
import exchange from "./modules/exchange";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    traders,
    exchange
  }
});
