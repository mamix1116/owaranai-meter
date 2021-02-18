import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    meetingData: {}
  },
  mutations: {
    setMeetingData(state, payload) {
      state.meetingData = payload
    }
  },
  actions: {
    setData({ commit }, payload) {
      commit('setMeetingData', payload)
    }
  }
})

export default store
