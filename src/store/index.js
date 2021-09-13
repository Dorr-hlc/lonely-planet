import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		redirectPage: '',
	},
	mutations: {
		redirect(state, payload) {
			state.redirectPage = payload.page
		},
	},
	actions: {
		
	},
	getters: {
		shopConfig: state => state.config,
	}
})

export default store