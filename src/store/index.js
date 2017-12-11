import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import user from './modules/user';
import ui from './modules/ui';
import shows from './modules/shows';
import playlist from './modules/playlist';

window.axios = require('axios');

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
	modules: {
		user,
		ui,
		shows,
		playlist,
	},
	strict: debug,
	plugins: [
		createPersistedState({
			paths: [
				'user',
				'playlist.track_ids',
				'playlist.tracks_by_id',
			]
		})
	]
})
