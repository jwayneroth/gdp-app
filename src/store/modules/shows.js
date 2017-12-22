import * as api from '../../api/shows'
import * as types from '../mutation-types'

// initial state
const state = {
	filterKey: null,       // 'years', 'venues', ('favorites', 'checked'?)
	filter: null,          // 1982,    'Winterland'
	filterVals: [],        // arr of years, venues
	shows: [],             // arr of shows for filter
	showId: null,          // single show id
	show: null,            // single show data
	list: [],              // arr of tracks, recordings or show teasers
	listType: null,        // 'favorite', 'checklist' 
	listMedia: null,       // 'track', 'recording', 'show'
	invalidateList: false, // force reload list
}

// getters
const getters = {

}

// actions
const actions = {
	
	getYears({state, commit}) {
		
		if (state.filterKey === 'years' && state.filterVals.length) return;
		
		api.getYears(years => {
			commit(types.GET_FILTER_VALS_SUCCESS, {filterKey: 'years', filterVals: years})
		})
	},
	
	getShowsForYear({state, commit}, year) {
		
		if (state.filterKey === 'years' && state.filter === year && state.shows !== null) return;
		
		api.getShowsForYear(year, shows => {
			commit(types.GET_SHOWS_SUCCESS, {filter: year, shows});
		})
	},
	
	getFullShow({state, commit}, {id}) {
		
		if (id === state.showId && state.show !== null) return;
		
		api.getFullShow(id, show => {
			commit(types.GET_FULL_SHOW_SUCCESS, {show});
		})
	},
	
	getTeasers({state, commit}, {media_type, list_type, ids}) {
		
		if (!state.invalidateList &&
			state.listMedia === media_type &&
			state.listType === list_type &&
			state.list !== null
		) {
			console.log('store bypass getTeasers');
			return;
		}
		
		console.log('getTeasers ' + media_type + ' ' + list_type);
		
		api.getTeasers(media_type, ids, list => {
			commit(types.GET_TEASERS_SUCCESS, {media_type, list_type, list})
		});
	}
}

// mutations
const mutations = {
	[types.GET_FILTER_VALS_SUCCESS](state, {filterKey, filterVals}) {
		state.filterKey = filterKey;
		state.filterVals = filterVals;
	},
	
	[types.GET_SHOWS_SUCCESS](state, {filter, shows}) {
		state.filter = filter;
		state.shows = shows
	},
	
	[types.GET_FULL_SHOW_SUCCESS](state, {show}) {
		state.showId = show.id;
		state.show = show;
	},
	
	[types.TOGGLE_USER_CHOICE](state) {
		console.log('shows store::TOGGLE_USER_CHOICE');
		state.invalidateList = true;
	},
	
	[types.GET_TEASERS_SUCCESS](state, {media_type, list_type, list}) {
		state.invalidateList = false;
		state.listType = list_type;
		state.listMedia = media_type;
		state.list = list;
	},
}

export default {
	state,
	getters,
	actions,
	mutations
}
