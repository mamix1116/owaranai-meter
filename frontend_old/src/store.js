import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    locale: {}
  },
  getters: {
    locale(state) {
      return state.locale
    }
  },
  mutations: {
    setLocale(state, payload) {
      state.locale = payload
    }
  },
  actions: {
    setLocale({ commit }, payload) {
      commit('setLocale', payload)
    }
  },
  modules: {}
})

export default store
