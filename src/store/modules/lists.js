import Vue from 'vue'

import * as types from '../mutation-types';
import * as utils from '../../lib/utils';
import * as api from '../../api/lists';
import {setAuthHeader} from '../../api/';

const initial_state = {
	list_ids: [],
	lists_by_id: {},
	active_list: {
		id: null,
		title: '',
		tracks: [],
		recordings: [],
		shows: [],
	},
}

const getters = {
	//listIds: state => utils.flattenObjectArray(state.lists),
}

const mutations = {
	
	[types['SET_USER']](state, user) {
		state.list_ids = utils.flattenObjectArray(user.Lists, 'id');
		state.lists_by_id = utils.arrayToObject(user.Lists, 'id');
	},
	
	[types['LOGOUT']](state) {
		state.list_ids = [];
		state.lists_by_id = {},
		state.active_list = initial_state.active_list;
	},
	
	[types['ADD_LIST']](state, list) {
		const {id, title} = list;
		state.list_ids.push(id);
		state.lists_by_id[id] = {id, title};
	},
	
	/*[types['TOGGLE_USER_CHOICE']](state, {list_key, media_id}) {
		console.log('user store::TOGGLE_USER_CHOICE', state[list_key]);
		const idx = state[list_key].indexOf(media_id);
		if (idx !== -1) {
			state[list_key] = utils.sliceIndex(state[list_key], idx);
		} else  {
			state[list_key] = [...state[list_key], media_id];
		}
		console.log('updated', state[list_key]);
	},*/
}

const actions = {
	
	createList({commit}, vals) {
		return new Promise((resolve, reject) => {
			api.saveNewList(vals)
				.then(list => {
					commit(types['ADD_LIST'], list);
					resolve();
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	
	/*set_user_choice({state, commit}, {list_type, media_type, media_id}) {
		
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
	},*/
}

export default {
	state: initial_state,
	getters,
	actions,
	mutations
}
