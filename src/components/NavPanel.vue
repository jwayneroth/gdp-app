<template>
	<div class="nav-panel" :style="'height: ' + height" ref="container">
		<div class="pane-container">
			<button v-if="activePane" class="pane-btn pane-close-btn" v-on:click="changePane(null)">
				<span class="fa fa-close" />
			</button>
			<div id="about-pane" ref="about" :class="[activePane === 'about' && 'active', 'pane']">
				<div class="inner">
					<div class="row">
						<div class="col-sm-8 offset-sm-2">
							<h2>About</h2>
							<p>Grateful Dead Portal is an index of and online player for Grateful Dead recordings available on the Internet Archive.<br>Users are invited to build a playlist from among the navigable shows, with the option of creating an account in order to save shows, recordings and individual tracks as favorites or in a checklist.<br><i>The site is a work in progress</i>.</p>
						</div>
					</div>
				</div>
			</div>
			<div id="login-pane" ref="login" :class="[activePane === 'login' && 'active', 'pane']">
				<div class="inner">
					<h2>Log In</h2>
					<div class="alert alert-danger" v-if="error"><p>{{ error }}</p></div>
					<form @submit.stop.prevent="login" id="login-form" action="#" method="post" class="mb-2">
						<div class="form-group">
							<input type="text" class="form-control" placeholder="Enter your email" v-model="credentials.email">
						</div>
						<div class="form-group">
							<input type="password" class="form-control" placeholder="Enter your password" v-model="credentials.password">
						</div>
						<button class="btn btn-primary" type="submit">submit</button>
					</form>
					<p>Haven't registered? Do so <a href="#" @click="changePane('register');">here</a>.</p>
				</div>
			</div>
			<div id="register-pane" ref="register" :class="[activePane === 'register' && 'active', 'pane']">
				<div class="inner">
					<h2>Sign Up</h2>
					<p>Sign up to keep track of your favorite shows</p>
					<div class="alert alert-danger" v-if="error"><p>{{ error }}</p></div>
					<form @submit.stop.prevent="register" id="register-form" action="#" method="post">
						<div class="form-group">
							<input type="text" class="form-control" placeholder="Username" v-model="credentials.username">
						</div>
						<div class="form-group">
							<input type="text" class="form-control" placeholder="Enter your email" v-model="credentials.email">
						</div>
						<div class="form-group">
							<input type="password" class="form-control" placeholder="Enter your password" v-model="credentials.password">
						</div>
						<button class="btn btn-primary" type="register">submit</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';

export default {
	props: {
		activePane: [String, Number],
		onResize: Function,
		changePane: Function,
	},
	components: {
	},
	data: function () {
		return {
			credentials: {
				username: null,
				email: null,
				password: null,
			},
			error: '',
			h: (this.activePane === null) ? 0 : this.$refs[this.activePane].scrollHeight,
		}
	},
	computed: {
		...mapState({
			user: 'user',
		}),
		height: function() {
			return this.h + 'px';
		},
	},
	methods: {
		login() {
			console.log('UserForms::login');
			
			const {email, password} = this.credentials;
			
			if (!email || !password) {
				this.error = 'You must fill out all the fields!';
				this.onResize();
				return;
			}
			
			this.error = '';
			
			this.$store.dispatch('login', {ctx: this, email, password});
		},
		register() {
			console.log('UserForms::register');
			
			const {username, email, password} = this.credentials;
			
			if (!username || !email || !password) {
				this.error = 'You must fill out all the fields!';
				this.onResize();
				return;
			}
			
			this.error = '';
			
			this.$store.dispatch('register', {ctx: this, username, email, password});
		},
	},
	created: function () {
	},
	updated: function() {
		//console.log('UserForms::updated');
		this.h = (this.activePane === null) ? 0 : this.$refs[this.activePane].scrollHeight;
	},
	watch: {
		'user.error': function(err) {
			this.error = err;
			this.onResize();
		}
	}
}
</script>

<style lang="scss">

</style>
