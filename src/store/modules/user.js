import Vue from 'vue'

import * as api from '../../api/user';
import * as types from '../mutation-types';
import * as utils from '../../lib/utils';

import {setAuthHeader} from '../../api/';

const initial_state = {
	id: null,
	username: null,
	logged_in: false,
	is_admin: false,
	token: null,
}

const getters = {
	
}

const mutations = {
	
	[types['LOGOUT']](state) {
		for (const key in initial_state) {
			Vue.set(state, key, initial_state[key]);
		}
	},
	
	[types['SET_AUTH']](state, {user}) {
		
		const new_state = {
			...user,
			logged_in: true,
		};
		
		for (const key in new_state) {
			Vue.set(state, key, new_state[key]);
		}
	},
	
	[types['TOGGLE_USER_CHOICE']](state, {list_key, media_id}) {
		console.log('user store::TOGGLE_USER_CHOICE', state[list_key]);
		const idx = state[list_key].indexOf(media_id);
		if (idx !== -1) {
			state[list_key] = utils.sliceIndex(state[list_key], idx);
		} else  {
			state[list_key] = [...state[list_key], media_id];
		}
		console.log('updated', state[list_key]);
	},
}

const actions = {
	
	/*checkAuth({commit}) {
		const token = localStorage.getItem('token');
		let jwt = (token) ? true : false;
		commit(types['SET_AUTH, {jwt});
	},*/
	
	login({commit}, payload) {
		api.login(payload, user => {
			setAuthHeader(user.token);
			commit(types['SET_AUTH'], {user});
		}, err => {});
	},
	
	register({commit}, payload) {
		api.register(payload, user => {
			setAuthHeader(user.token);
			commit(types['SET_AUTH'], {user});
		}, err => {});
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
			commit(types['TOGGLE_USER_CHOICE'], {list_key, media_id});
		});
	},
}

export default {
	state: initial_state,
	getters,
	actions,
	mutations
}
