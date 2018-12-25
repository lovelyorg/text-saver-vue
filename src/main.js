// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import Vuex from 'vuex'
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";

Vue.config.productionTip = false;

Vue.use(Vuex)
Vue.use(MintUI);

const store = new Vuex.Store({
  state: {
    searchValue: ''
  },
  mutations: {
    searchValue: (state, value) => state.searchValue = value,
  }
})

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  components: { App },
  template: "<App/>"
});
