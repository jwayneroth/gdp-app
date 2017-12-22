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
	recording_stars: [],
	recording_checks: [],
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
	
	set_user_choice({state, commit}, {list_type, media_type, media_id}) {
		
		let list_title = (list_type === 'checklist') ? 'checks' : 'stars';
		
		if (list_type === 'checklist') {
			list_title = 'checks';
		}
		
		const list_key = media_type + '_' + list_title;
		const list = state[list_key];
		const curr = (list.indexOf(media_id) !== -1);
		
		api.set_user_choice(media_type, list_type, media_id, !curr, res => {
			commit(types.TOGGLE_USER_CHOICE, {list_key, media_id});
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
			recording_stars: flattenObjectArray(user.Recordings, 'is_favorite'),
			recording_checks: flattenObjectArray(user.Recordings, 'is_checked'),
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
	
	[types.TOGGLE_USER_CHOICE](state, {list_key, media_id}) {
		console.log('user store::TOGGLE_USER_CHOICE');
		const idx = state[list_key].indexOf(media_id);
		if (idx !== -1) {
			state[list_key] = sliceIndex(state[list_key], idx);
		} else  {
			state[list_key] = [...state[list_key], media_id];
		}
	},
}

export default {
	state: initial_state,
	getters,
	actions,
	mutations
}
