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
	
	[types['SET_TOKEN']](state, token) {
		state.token = token;
	},
	
	[types['LOGOUT']](state) {
		for (const key in initial_state) {
			Vue.set(state, key, initial_state[key]);
		}
	},
	
	[types['SET_USER']](state, user) {
		
		const {id, username, is_admin} = user;
		
		const new_state = {
			id,
			username,
			is_admin,
			logged_in: true,
		};
		
		for (const key in new_state) {
			Vue.set(state, key, new_state[key]);
		}
	},
}

const actions = {
	
	/**
	 * if we have a token, give it to axios and test it
	 */
	checkToken({commit, dispatch, state}) {
		if (state.token && state.token !== '') {
			setAuthHeader(state.token);
			dispatch('getUser');
		}
	},
	
	/**
	 * get user data with token
	 * called after login, register, resetPassword, checkToken
	 */
	getUser({commit, dispatch, state, rootState}) {
		console.log('store::getUser');
		
		return new Promise((resolve, reject) => {
			api.getUser()
			.then(user => {
				commit(types['SET_USER'], user);
				resolve();
			})
			.catch(err => {
				reject(err);
			});
		});
	},
	
	login({commit}, payload) {
		api.login(payload, user => {
			setAuthHeader(user.token);
			commit(types['SET_TOKEN'], user.token);
			commit(types['SET_USER'], user);
		}, err => {});
	},
	
	register({commit}, payload) {
		api.register(payload, user => {
			setAuthHeader(user.token);
			commit(types['SET_TOKEN'], user.token);
			commit(types['SET_USER'], user);
		}, err => {});
	},
}

export default {
	state: initial_state,
	getters,
	actions,
	mutations
}
