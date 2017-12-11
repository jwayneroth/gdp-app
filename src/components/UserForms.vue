<template>
	<div class="user-forms" :style="'height: ' + height" ref="container">
		<div class="inner" ref="inner">
			<div id="login" ref="login" :class="activeForm === 'login' && 'active'">
				<h2>Log In</h2>
				<div class="alert alert-danger" v-if="error"><p>{{ error }}</p></div>
				<div class="form-group">
					<input type="text" class="form-control" placeholder="Enter your email" v-model="credentials.email">
				</div>
				<div class="form-group">
					<input type="password" class="form-control" placeholder="Enter your password" v-model="credentials.password">
				</div>
				<button class="btn btn-primary" v-on:click="login">submit</button>
			</div>
			<div id="register" ref="register" :class="activeForm === 'register' && 'active'">
				<h2>Sign Up</h2>
				<p>Sign up to keep track of your favorite shows</p>
				<div class="alert alert-danger" v-if="error"><p>{{ error }}</p></div>
				<div class="form-group">
					<input type="text" class="form-control" placeholder="Username" v-model="credentials.username">
					<input type="text" class="form-control" placeholder="Enter your email" v-model="credentials.email">
				</div>
				<div class="form-group">
					<input type="password" class="form-control" placeholder="Enter your password" v-model="credentials.password">
				</div>
				<button class="btn btn-primary" v-on:click="register">submit</button>
			</div>
		</div>
	</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';

export default {
	props: {
		activeForm: [String, Number],
		onResize: Function,
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
			h: (this.activeForm === null) ? 0 : this.$refs[this.activeForm].scrollHeight,
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
		this.h = (this.activeForm === null) ? 0 : this.$refs[this.activeForm].scrollHeight;
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
@import "compass/css3";

.user-forms {
	@include transition(height .2s ease-in-out);
	
	.inner > div {
		visibility: hidden;
		height: 0;
		opacity: 0;
		@include transition(opacity .2s ease-in-out);
		
		&.active {
			visibility: visible;
			height: auto;
			opacity: 1.0;
		}
	}
}
</style>
