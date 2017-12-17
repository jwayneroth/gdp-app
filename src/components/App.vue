<template>
	<div id="app">
		<header id="header" ref="header">
			<div class="container-fluid">
				<b-navbar class="d-flex flex-row align-items-end justify-content-between">
					<router-link to="/" id="site-logo" class="d-block"><img src="/static/img/logo.png" width="123" height="120" class=""></router-link>
					<h1 id="site-title" class="mt-3">Grateful Dead Portal</h1>
					<b-navbar-nav class="d-flex flex-row align-items-start">
						<b-nav-item ref="about_toggle" @click="showPane('about')">About</b-nav-item>
						<b-nav-item v-if="!user.logged_in" ref="login_toggle" @click="showPane('login')">Login</b-nav-item>
						<!--<b-nav-item v-if="!user.logged_in" ref="register_toggle" @click="showPane('register')">Register</b-nav-item>-->
						<b-nav-item v-if="user.logged_in" to="/user">{{user.username}}</b-nav-item>
						<b-nav-item v-if="user.logged_in" @click="logout">Logout</b-nav-item>
					</b-navbar-nav>
				</b-navbar>
				<nav-panel :activePane="active_pane" :onResize="onHeaderResize" ref="user_forms" :changePane="showPane"/>
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
import NavPanel from './NavPanel.vue';
import AudioPlayer from './AudioPlayer.vue';
import {setAuthHeader} from '../api';

const debounce = require('lodash.debounce');

export default {
	name: 'app',
	components: {
		ResizablePanel,
		NavPanel,
		AudioPlayer,
	},
	data: function () {
		return {
			active_pane: null,
			header_height_normal: 55,
			header_height_auth: 275,
			main_height: 0,
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
		showPane: function(panel) {
			if (this.active_pane === panel) {
				this.active_pane = null;
			} else {
				this.active_pane = panel;
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
				if (this.active_pane === 'login' || this.active_pane === 'register') {
					this.active_pane = null;
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
</style>
