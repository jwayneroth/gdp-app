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

export function set_user_choice(media, list, media_id, val, cb) {
	
	const endpoint = API_URL + '/users/choice/' + media + '/' + list + '/' + media_id;
	
	axios.post(endpoint, {val})
	.then((response) => {
		cb(response.data);
	})
	.catch((err) => {
		console.log('api::set_user_choice error', err); //.response.data);
	});
}

