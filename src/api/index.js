export const axios = require('axios');

export const API_URL = ''; //'http://localhost:4000';

export function setAuthHeader(token) {
	window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
