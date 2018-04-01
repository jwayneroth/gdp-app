import Vue from 'vue'

import * as types from '../mutation-types';

const initial_state = {
	leftOpen: true,
	rightOpen: true,
	leftWidth: .6,
	rightWidth: .4,
	leftWidthLast: .6,
	rightWidthLast: .4,
}

const getters = {}

const mutations = {
	
	/**
	 * close a pane
	 * if other pane open, save widths
	 */
	[types['CLOSE_PANE']](state, pane) {
		
		if (!state[pane + 'Open']) return;
		
		const otherPane = (pane === 'left') ? 'right' : 'left';
		
		if (state[otherPane + 'Open']) {
			state.lastLeftWidth = state.leftWidth;
			state.lastRightWidth = state.rightWidth;
			state[otherPane + 'Width'] = 1;
		}
		
		state[pane + 'Width'] = 0;
		state[pane + 'Open'] = false;
	},
	
	/**
	 * open a pane
	 * if other pane open, use saved pane widths
	 */
	[types['OPEN_PANE']](state, pane) {
		
		if (state[pane + 'Open']) return;
		
		const otherPane = (pane === 'left') ? 'right' : 'left';
		
		// if other pane open, use saved widths
		if (state[otherPane + 'Open']) {
			state[pane + 'Width'] = state[pane + 'WidthLast'];
			state[otherPane + 'Width'] = state[otherPane + 'WidthLast'];
		} else {
			state[pane + 'Width'] = 1;
		}
		state[pane + 'Open'] = true;
	},
	
	[types['RESIZE_PANES']](state, width) {
		state.leftWidth = state.leftWidthLast = width;
		state.rightWidth = state.rightWidthLast = 1 - width;
	},
}

const actions = {}

export default {
	state: initial_state,
	//getters,
	//actions,
	mutations
}
