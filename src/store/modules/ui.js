import Vue from 'vue'

import * as types from '../mutation-types';

// initial state
const initial_state = {
	player_open: false,
	player_width: .5,
	player_last_width: .5,
}

// getters
const getters = {
	
}

// actions
const actions = {
	
	togglePlayer({dispatch, commit, state}) {
		
		if (state.player_open) {
			commit(types.SET_PLAYER_LAST_WIDTH, {width: state.player_width});
			dispatch('resizePlayer', 0);
		} else {
			dispatch('resizePlayer', state.player_last_width);
		}
		commit(types.TOGGLE_PLAYER);
	},
	
	resizePlayer({commit}, width) {
		commit(types.SET_PLAYER_WIDTH, {width});
	},
}

// mutations
const mutations = {
	[types.TOGGLE_PLAYER](state) {
		state.player_open = !state.player_open;
	},
	[types.SET_PLAYER_WIDTH](state, {width}) {
		state.player_width = width;
	},
	[types.SET_PLAYER_LAST_WIDTH](state, {width}) {
		state.player_last_width = width;
	}
}

export default {
	state: initial_state,
	getters,
	actions,
	mutations
}
