<template>
	<div id="form-list" class="modal-content">
		<header class="modal-header">
			<div>
				<!--<button-close-custom :click="() => {$store.dispatch('hideModal')}" />
				<h4 class="modal-title">Sign in to Play!</h4> -->
			</div>
		</header>
		<div class="modal-body">
			<div :class="'text-' + status" v-if="message"><p v-html="message"/></div>
			<div class="alert alert-danger" v-if="loginError"><p v-html="loginError"></p></div>
			<div class="form-group">
				<input type="text" class="form-control" placeholder="Enter your email or username" v-model="loginValues.login">
			</div>
			<div class="form-group">
				<input type="password" class="form-control" placeholder="Enter your password" v-model="loginValues.password">
			</div>
			<div class="checkbox">
				<input type="checkbox" name="remember" id="remember" :checked="loginValues.remember" @click.prevent="toggleRemeber">
				<label for="remember">Remember Me</label>
			</div>
			<div class="text-center"><b-button type="submit" variant="primary" v-on:click="login">submit</b-button></div>
		</div>
		<footer class="modal-footer">
			<div>
				<p>Haven't signed up yet? <a href="#" @click.prevent="toggleRegister">Get Started</a></p>
				<p>
					<span>Forgot your password? </span>
					<a href="#" role="button" @click.prevent="$store.dispatch('showModal', {modalType: 'form-forgot'})">Click here.</a>
				</p>
			</div>
		</footer>
	</div>
</template>

<script>

export default {
	name: 'modal-list-add-create',
	props: {
		status: { type: String, default: 'info' },
		message: { type: String, default: null },
	},
	components: {
	},
	data: function() {
		return {
			loginValues: {
				login: null,
				password: null,
				remember: false,
			},
			loginError: '',
		}
	},
	methods: {
		
		login() {
			console.log('LoginForm::login');
			
			this.$store.dispatch('updateTrackers', {contestAction: 'form-login-submit'});
			
			const {login, password, remember} = this.loginValues;
			
			if (!login || login === '' || !password || password === '') {
				this.loginError = 'You must fill out all the fields!';
				return;
			}
			
			this.loginError = '';
			
			this.$store.dispatch('login', {login, password, remember})
			.then(() => {
				this.$store.dispatch('hideModal');
			})
			.catch(err => {
				this.loginError = err;
			});
		},
		
		toggleRegister() {
			this.$store.dispatch('updateTrackers', {contestAction: 'register'});
			this.$store.dispatch('showModal', {modalType: 'form-register'})
		},
		
		toggleRemeber() {
			this.$store.dispatch('updateTrackers', {contestAction: 'forgot'});
			this.loginValues.remember = !this.loginValues.remember;
		}
	}
}
</script>
