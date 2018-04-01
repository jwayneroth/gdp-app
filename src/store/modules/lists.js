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
					createdAt: item.createdAt,
					showIds: utils.flattenObjectArray(item.Shows, 'id'),
					recordingIds: utils.flattenObjectArray(item.Recordings, 'id'),
					trackIds: utils.flattenObjectArray(item.Tracks, 'id'),
				}
			}
		})
	);
}

const parseListTracks = function(tracks) {
	const flat = tracks.map(t => {
		const {id, title, file, length} = t;
		return {
			id,
			title,
			file,
			length,
			showId: t.Recording.Show.id,
			recordingId: t.Recording.id,
			recordingDate: t.Recording.date,
			recordingTitle: t.Recording.title,
		}
	});
	return utils.arrayToObject(flat, 'id');
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
		createdAt: '',
		isPublic: false,
		showIds: [],
		recordingIds: [],
		trackIds: [],
		showsById: {},
		recordingsById: {},
		tracksById: {},
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
		const {id, title, createdAt} = list;
		const newList = {
			id,
			title,
			createdAt,
			showIds: [],
			recordingIds: [],
			trackIds: [],
		};
		if (media && media.hasOwnProperty('type')) {
			state[media.type + "Ids"].push(media.id);
			newList[media.type + "Ids"].push(media.id);
		}
		state.ids.push(id);
		state.byId[id] = newList;
	},
	
	[types['ACTIVATE_LIST']](state, list) {
		const {id, title, createdAt, isPublic} = list;
		
		state.activeList = {
			id,
			title,
			createdAt,
			isPublic,
			showIds: utils.flattenObjectArray(list.Shows, 'id'),
			recordingIds: utils.flattenObjectArray(list.Recordings, 'id'),
			trackIds: utils.flattenObjectArray(list.Tracks, 'id'),
			showsById: utils.arrayToObject(list.Shows, 'id'),
			recordingsById: utils.arrayToObject(list.Recordings, 'id'),
			tracksById: parseListTracks(list.Tracks),
		}
	},
	
	[types['DEACTIVATE_LIST']](state) {
		state.activeList = {...initial_state.activeList};
	},
	
	[types['UPDATE_MEDIA']](state, {listIds, media}) {
		console.log('UPDATE_MEDIA');
		console.log('listIds', listIds);
		console.log('media', media);
		if (media.hasOwnProperty('type')) {
			state[media.type + "Ids"].push(media.id);
			listIds.forEach(listId => {
				state.byId[listId][media.type + "Ids"].push(media.id);
			});
		}
	},
	
	[types['RENAME_LIST']](state, {id, title}) {
		state.byId[id] = {
			...state.byId[id],
			title
		};
		if (state.activeList.id === id) state.activeList.title = title;
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
	
	getFullList({commit}, listId) {
		console.log('store::getFullList ' + listId);
		
		return new Promise((resolve, reject) => {
			api.getFullList(listId)
			.then(list => {
				commit(types['ACTIVATE_LIST'], list);
				resolve();
			})
			.catch(err => {
				reject(err);
			});
		});
	},
	
	/**
	 * tell api to delete our list
	 * call getUser to update our list state
	 * (easier/maybe only way) to update media ids
	 */
	deleteList({state, commit, dispatch}, listId) {
		return new Promise((resolve, reject) => {
			api.deleteList(listId)
			.then(() => {
				if (state.activeList.id === listId) commit(types['DEACTIVATE_LIST']);
				dispatch('getUser');
				resolve();
			})
			.catch(err => {
				reject(err);
			});
		});
	},
	
	renameList({commit}, vals) {
		return new Promise((resolve, reject) => {
			api.renameList(vals)
			.then(() => {
				commit(types['RENAME_LIST'], vals);
				resolve();
			})
			.catch(err => {
				reject(err);
			});
		});
	}
}

export default {
	state: initial_state,
	getters,
	actions,
	mutations
}
