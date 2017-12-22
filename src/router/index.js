import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/Home';
import Year from '../components/Year';
import Show from '../components/Show';
import {User, UserHome} from '../components/User.js';
import UserList from '../components/UserList';

Vue.use(VueRouter);

export default new VueRouter({
	mode: 'history',
	routes: [
		{path: '/', redirect: '/years'},
		{path: '/years', component: Home},
		{path: '/years/:year', component: Year},
		{path: '/shows/:show_id', component: Show},
		{path: '/user', component: User,
			children: [
				{ path: '', component: UserHome },
				{ path: 'checklist/track', component: UserList },
				{ path: 'checklist/recording', component: UserList },
				{ path: 'checklist/show', component: UserList },
				{ path: 'favorite/track', component: UserList },
				{ path: 'favorite/recording', component: UserList },
				{ path: 'favorite/show', component: UserList },
			 ],
		},
		{path: '*', name: '404', component: Home},
	]
})
