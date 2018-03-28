import Vue from 'vue'

import * as types from '../mutation-types';
import * as utils from '../../lib/utils';
import * as api from '../../api/lists';
import {setAuthHeader} from '../../api/';

const parseListData = function(arr) {
	return Object.assign(
		{},
		...arr.map(item => {
			console.log(item);
			return {
				[item['id']]: {
					id: item.id,
					title: item.title,
					shows: utils.flattenObjectArray(item.Shows, 'id'),
					recordings: utils.flattenObjectArray(item.Recordings, 'id'),
					tracks: utils.flattenObjectArray(item.Tracks, 'id'),
				}
			}
		})
	);
}

const initial_state = {
	ids: [],
	byId: {},
	showIds: [],
	recordingIds: [],
	trackIds: [],
	activeList: {
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
		state.ids = utils.flattenObjectArray(user.Lists, 'id');
		state.byId = parseListData(user.Lists);
		state.showIds = utils.flattenObjectArraySubArray(user.Lists, 'Shows', 'id');
		state.recordingIds = utils.flattenObjectArraySubArray(user.Lists, 'Recordings', 'id');
		state.trackIds = utils.flattenObjectArraySubArray(user.Lists, 'Tracks', 'id');
	},
	
	[types['ADD_LIST']](state, {list, media}) {
		const {id, title} = list;
		const newList = {
			id,
			title,
			shows: [],
			recordings: [],
			tracks: []
		};
		if (media.hasOwnProperty('type')) {
			state[media.type + "Ids"].push(media.id);
			newList[media.type + "s"].push(media.id);
		}
		state.ids.push(id);
		state.byId[id] = newList;
	},
	
	[types['UPDATE_MEDIA']](state, {listIds, media}) {
		if (media.hasOwnProperty('type')) {
			state[media.type + "Ids"].push(media.id);
			listIds.forEach(listId => {
				state.byId[listId][media.type + "s"].push(media.id);
			});
		}
	},
	
	[types['LOGOUT']](state) {
		state.ids = [];
		state.byId = {};
		state.showIds = [];
		state.recordingIds = [];
		state.trackIds = [];
		state.activeList = initial_state.activeList;
	},
}

const actions = {
	
	/**
	 * create a new list for the user
	 * pass media type and id to add to new list
	 * vals = {title: "foo", media: {type: "track", id: 45}};
	 */
	createList({commit}, vals) {
		return new Promise((resolve, reject) => {
			api.saveNewList(vals)
				.then(list => {
					const {media} = vals;
					commit(types['ADD_LIST'], {list, media});
					resolve();
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	
	/**
	 * add a media item to a list or lists
	 * pass array of list ids and media type and id to add to the list
	 * vals = {listIds: [], media: {type: "track", id: 45}};
	 */
	addMediaToList({commit}, {listIds, media}) {
		
		const promises = [];
		
		listIds.forEach(listId => {
			promises.push(api.updateList({listId, media}))
		});
		
		return new Promise((resolve, reject) => {
			Promise.all(promises)
			.then((res) => {
				commit(types['UPDATE_MEDIA'], {listIds, media});
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
