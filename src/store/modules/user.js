import Vue from 'vue'

import * as api from '../../api/user';
import * as types from '../mutation-types';

import {setAuthHeader} from '../../api/';

const sliceIndex = function(arr, idx) {
	const copy = arr.slice();
	copy.splice(idx, 1);
	return copy;
}

const flattenObjectArray = function(arr, flag) {
	return arr.reduce((res, val) => {
		if (val[flag]) res.push(val.id);
		return res;
	}, []);
}

// initial state
const initial_state = {
	id: null,
	username: null,
	logged_in: false,
	error: '',
	token: null,
	track_stars: [],
	track_checks: [],
	show_stars: [],
	show_checks: [],
}

// getters
const getters = {
	
}

// actions
const actions = {
	
	/*checkAuth({commit}) {
		const token = localStorage.getItem('token');
		let jwt = (token) ? true : false;
		commit(types.SET_AUTH, {jwt});
	},*/
	
	login({commit}, payload) {
		api.login(payload, user => {
			setAuthHeader(user.token);
			commit(types.SET_AUTH, {user});
		}, err => commit(types.SET_AUTH_ERROR, {err}));
	},
	
	register({commit}, payload) {
		api.register(payload, user => {
			setAuthHeader(user.token);
			commit(types.SET_AUTH, {user});
		}, err => commit(types.SET_AUTH_ERROR, {err}));
	},
	
	set_favorite_track({state, commit}, track_id) {
		const curr = (state.track_stars.indexOf(track_id) !== -1);
		api.set_user_choice('track', 'favorite', track_id, !curr, res => {
			commit(types.TOGGLE_FAVORITE_TRACK, {track_id});
		});
	},
	
	set_checklist_track({state, commit}, track_id) {
		const curr = (state.track_checks.indexOf(track_id) !== -1);
		api.set_user_choice('track', 'checklist', track_id, !curr, res => {
			commit(types.TOGGLE_CHECKLIST_TRACK, {track_id});
		});
	},
	
	set_favorite_show({state, commit}, show_id) {
		const curr = (state.show_stars.indexOf(show_id) !== -1);
		api.set_user_choice('show', 'favorite', show_id, !curr, res => {
			commit(types.TOGGLE_FAVORITE_SHOW, {show_id});
		});
	},
	
	set_checklist_show({state, commit}, show_id) {
		const curr = (state.show_checks.indexOf(show_id) !== -1);
		api.set_user_choice('show', 'checklist', show_id, !curr, res => {
			commit(types.TOGGLE_CHECKLIST_SHOW, {show_id});
		});
	},
}

// mutations
const mutations = {
	
	[types.LOGOUT](state) {
		for (const key in initial_state) {
			Vue.set(state, key, initial_state[key]);
		}
	},
	
	[types.SET_AUTH](state, {user}) {
		
		const {id, username, token} = user;
		
		const new_state = {
			id,
			username,
			logged_in: true,
			error: '',
			token,
			track_stars: flattenObjectArray(user.Tracks, 'is_favorite'),
			track_checks: flattenObjectArray(user.Tracks, 'is_checked'),
			show_stars: flattenObjectArray(user.Shows, 'is_favorite'),
			show_checks: flattenObjectArray(user.Shows, 'is_checked'),
		};
		
		for (const key in new_state) {
			Vue.set(state, key, new_state[key]);
		}
	},
	
	[types.SET_AUTH_ERROR](state, {err}) {
		state.error = err;
	},
	
	[types.TOGGLE_FAVORITE_TRACK](state, {track_id}) {
		const idx = state.track_stars.indexOf(track_id);
		if (idx !== -1) {
			state.track_stars = sliceIndex(state.track_stars, idx);
		} else  {
			state.track_stars = [...state.track_stars, track_id];
		}
	},
	
	[types.TOGGLE_CHECKLIST_TRACK](state, {track_id}) {
		const idx = state.track_checks.indexOf(track_id);
		if (idx !== -1) {
			state.track_checks = sliceIndex(state.track_checks, idx);
		} else  {
			state.track_checks = [...state.track_checks, track_id];
		}
	},
	
	[types.TOGGLE_FAVORITE_SHOW](state, {show_id}) {
		const idx = state.show_stars.indexOf(show_id);
		if (idx !== -1) {
			state.show_stars = sliceIndex(state.show_stars, idx);
		} else  {
			state.show_stars = [...state.show_stars, show_id];
		}
	},
	
	[types.TOGGLE_CHECKLIST_SHOW](state, {show_id}) {
		const idx = state.show_checks.indexOf(show_id);
		if (idx !== -1) {
			state.show_checks = sliceIndex(state.show_checks, idx);
		} else  {
			state.show_checks = [...state.show_checks, show_id];
		}
	},
}

export default {
	state: initial_state,
	getters,
	actions,
	mutations
}
