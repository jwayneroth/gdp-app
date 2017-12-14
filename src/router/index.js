import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/Home';
import Year from '../components/Year';
import Show from '../components/Show';

Vue.use(VueRouter);

export default new VueRouter({
	mode: 'history',
	routes: [
		{path: '/', redirect: '/years'},
		{path: '/years', component: Home},
		{path: '/years/:year', component: Year},
		{path: '/shows/:show_id', component: Show},
	]
})
