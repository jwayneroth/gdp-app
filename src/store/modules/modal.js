import Vue from 'vue'

import * as types from '../mutation-types';

const initial_state = {
	modalType: null,
	modalProps: {},
}

const getters = {
	
}

const mutations = {
	
	[types['SHOW_MODAL']](state, payload) {
		state.modalType = payload.modalType;
		state.modalProps = payload.modalProps;
	},
	
	[types['HIDE_MODAL']](state) {
		state.modalType = null;
		state.modalProps = {};
	},
}

const actions = {
	
	showModal({commit}, {modalType, modalProps}) {
		console.log('modal::showModal ' + modalType);
		commit(types['SHOW_MODAL'], {
			modalType,
			modalProps
		});
	},
	
	hideModal({commit}) {
		commit(types['HIDE_MODAL']);
	},
}

export default {
	state: Object.assign({},initial_state),
	getters,
	actions,
	mutations
}
