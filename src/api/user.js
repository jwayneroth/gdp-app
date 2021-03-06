import {axios, API_URL, setAuthHeader} from './';

export function login(payload, cb, fail) {
	
	const {ctx, email, password} = payload;
	
	axios({
		url: API_URL + '/users/login',
		method: 'post',
		auth: {
			username: email,
			password,
		}
	})
	.then((response) => {
		console.log('api::login success', response.data);
		cb(response.data);
	})
	.catch((err) => {
		console.log('api::login error', err.response.data);
		//ctx.error = err.response.data;
		fail(err.response.data);
	});
}

export function register(payload, cb, fail) {
	
	const {ctx, username, email, password} = payload;
	
	axios.post(API_URL + '/users/register', {username, email, password})
	.then((response) => {
		console.log('api::register success', response.data);
		cb(response.data);
	})
	.catch((err) => {
		console.log('api::register error', err.response.data);
		//ctx.error = err.response.data;
		fail(err.response.data);
	});
}

export function getUser() {
	return new Promise((resolve, reject) => {
		axios.get(API_URL + '/api/user')
		.then((response) => {
			console.log('api::getUser success', response.data);
			resolve(response.data);
		})
		.catch((err) => {
			console.log('api::getUser error', err.response.data);
			reject(err.response.data);
		});
	});
}
