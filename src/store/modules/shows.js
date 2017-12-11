import * as api from '../../api/shows'
import * as types from '../mutation-types'

// initial state
const state = {
	filterKey: null,      // 'years', 'venues', ('favorites', 'checked'?)
	filter: null,         // 1982,    'Winterland'
	filterVals: [],       // arr of years, venues
	shows: [],            // arr of shows for filter
	showId: null,         // recordings query show
	show: null,           //
}

// getters
const getters = {

}

// actions
const actions = {
	
	getYears({commit}) {
		api.getYears(years => {
			commit(types.GET_FILTER_VALS_SUCCESS, {filterKey: 'years', filterVals: years})
		})
	},
	
	getShowsForYear({state, commit}, year) {
		
		if (year === state.currentYear && state.showsForYear !== null) return;
		
		api.getShowsForYear(year, shows => {
			//const shows = yearObj.shows;
			commit(types.GET_SHOWS_SUCCESS, {filter: year, shows});
		})
	},
	
	getFullShow({state, commit}, {id}) {
		
		if (id === state.showId && state.show !== null) return;
		
		api.getFullShow(id, show => {
			commit(types.GET_FULL_SHOW_SUCCESS, {show});
		})
	},
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
}

export default {
	state,
	getters,
	actions,
	mutations
}
