import * as types from '../mutation-types'

// initial state
const state = {
	track_ids: [],
	tracks_by_id: {}
}

// getters
const getters = {
	
}

// actions
const actions = {
	
}

// mutations
const mutations = {
	
	[types['ADD_TRACKS']](state, {tracks}) {
		let new_tracks = {},
			new_ids = [];
		
		for (var t of tracks) {
			if (state.track_ids.indexOf(t.id) === -1) {
				new_ids.push(t.id);
				new_tracks[t.id] = t;
			}
		}
		
		state.track_ids = [
			...state.track_ids,
			...new_ids
		];
		
		state.tracks_by_id = Object.assign(
			{},
			state.tracks_by_id,
			new_tracks
		);
	},
	
	[types['REMOVE_TRACK']](state, {track_id}) {
		
		state.track_ids.splice(state.track_ids.indexOf(track_id), 1)
		
		delete state.tracks_by_id[track_id];
	},
	
	[types['UPDATE_PLAYLIST']](state, {tracks}) {
		let new_tracks = {},
			new_ids = [];
			
		for (var t of tracks) {
			new_ids.push(t.id);
			new_tracks[t.id] = t;
		}
		
		state.tracks_by_id = new_tracks;
		state.track_ids = new_ids;
	},
	
	[types['EMPTY_PLAYLIST']](state) {
		state.tracks_by_id = {};
		state.track_ids = [];
	},
}

export default {
	state,
	//getters,
	//actions,
	mutations
}
