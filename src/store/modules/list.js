import Vue from 'vue'

import * as types from '../mutation-types';
import * as utils from '../../lib/utils';

import {setAuthHeader} from '../../api/';

const initial_state = {
	list_ids: [],
	lists_by_id: null,
	active_list: {
		id: null,
		name: '',
		tracks: [],
		recordings: [],
		shows: [],
	},
}

const getters = {
	//listIds: state => utils.flattenObjectArray(state.lists),
}

const mutations = {
	
	[types['SET_AUTH']](state, {user}) {
		
		const list_ids = utils.flattenObjectArray(user.Lists);
		const lists_by_id = utils.arrayToObject(user.Lists, 'id');
		
		delete user.Lists;
		
		const new_state = {
			list_ids,
			lists_by_id,
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
