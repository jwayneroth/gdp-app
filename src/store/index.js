import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import user from './modules/user';
import ui from './modules/ui';
import shows from './modules/shows';
import playlist from './modules/playlist';
import lists from './modules/lists';
import modal from './modules/modal';

window.axios = require('axios');

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

let plugins;

// create localStorage plugin in try statement
// allows for Safari Private Mode usage
try {
	plugins = [
		createPersistedState({
			key: 'gdp',
			paths: [
				'user',
				'ui',
				'playlist.track_ids',
				'playlist.tracks_by_id',
			],
			//storage: window.localStorage,
		}),
	];
} catch (err) {
	plugins = [];
}

export default new Vuex.Store({
	modules: {
		user,
		ui,
		shows,
		playlist,
		lists,
		modal,
	},
	strict: debug,
	plugins,
})
