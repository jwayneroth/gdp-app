<template>
	<div id="app">
		<header id="header" ref="header">
			<div class="container-fluid">
				<b-navbar>
					<b-navbar-brand to="/">gdp</b-navbar-brand>
					<b-navbar-nav class="">
						<b-nav-item v-if="!user.logged_in" ref="login_toggle" @click="toggleForm('login')">Login</b-nav-item>
						<b-nav-item v-if="!user.logged_in" ref="register_toggle" @click="toggleForm('register')">Register</b-nav-item>
						<b-nav-item v-if="user.logged_in" to="/user">{{user.username}}</b-nav-item>
						<b-nav-item v-if="user.logged_in" @click="logout">Logout</b-nav-item>
					</b-navbar-nav>
				</b-navbar>
				<user-forms :activeForm="active_form" :onResize="onHeaderResize" ref="user_forms"></user-forms>
			</div>
		</header>
		<main id="main" ref="main" :style="styles.main">
			<resizable-panel left_name="Library" right_name="Player">
				<router-view slot="left-pane"></router-view>
				<audio-player slot="right-pane"></audio-player>
			</resizable-panel>
		</main>
	</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';

import ResizablePanel from './ResizablePanel.vue';
import UserForms from './UserForms.vue';
import AudioPlayer from './AudioPlayer.vue';
import {setAuthHeader} from '../api';

const debounce = require('lodash.debounce');

export default {
	name: 'app',
	components: {
		ResizablePanel,
		UserForms,
		AudioPlayer,
	},
	data: function () {
		return {
			active_form: null,
			header_height_normal: 55,
			header_height_auth: 275,
			main_height: 0,
			activeForm: null,
		}
	},
	computed: {
		...mapState({
			user: 'user',
		}),
		styles: function() {
			return {
				main: {
					height: this.main_height + 'px',
				},
			}
		}
	},
	methods: {
		toggleForm: function(form) {
			if (this.active_form === form) {
				this.active_form = null;
			} else {
				this.active_form = form;
			}
			setTimeout(this.resize, 150);
		},
		logout: function() {
			console.log('App::logout');
			this.$store.commit('LOGOUT');
		},
		onHeaderResize: function() {
			console.log('App::onHeaderResize');
			setTimeout(this.resize, 500);
		},
		resize: function(evt) {
			console.log('App::resize');
			this.main_height = document.documentElement.clientHeight - (this.$refs.header.clientHeight);
		},
	},
	watch: {
		'user.logged_in': function(logged_in) {
			console.log('App::logged_in change', logged_in);
			if (logged_in === true) {
				if (this.active_form !== null) {
					this.active_form = null;
					setTimeout(this.resize, 250);
				}
			}
		},
	},
	// TODO: check store access token
	created: function() {
		if (this.$store.state.user.token) {
			setAuthHeader(this.$store.state.user.token);
		}
	},
	mounted: function() {
		this.debounced_resize = debounce(this.resize, 200);
		window.addEventListener('resize', this.debounced_resize);
		this.resize();
	},
	beforeDestroy: function () {
		window.removeEventListener('resize', this.debounced_resize);
	},
}
</script>

<style lang="scss">
@import "../assets/scss/app.scss";

html {
	font-size: 75%;
}

#app {
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0; top: 0;
	right: 0; bottom: 0;
}

#header {
	left: 0; top: 0;
	z-index: 100;
}

#main {
	position: relative;
	top: 0; left: 0;
	width: 100%;
	height: 100%;
	background-color: #8f8f8f;
}
</style>
