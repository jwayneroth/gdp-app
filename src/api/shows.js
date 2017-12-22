import {axios, API_URL, setAuthHeader} from './';

export function getYears(cb) {
	axios.get(API_URL + '/api/years')
	.then((response) => {
		console.log('api::getYears success', response.data);
		cb(response.data);
	})
	.catch((err) => {
		console.error('api::getYears error', err);
	})
};

export function getShowsForYear(year, cb) {
	axios.get(API_URL + '/api/years/' + year)
	.then((response) => {
		console.log('api::getShowsForYear success', response.data);
		cb(response.data);
	})
	.catch((err) => {
		console.error('api::getShowsForYear error', err);
	})
};

export function getShowById(id, cb) {
	axios.get(API_URL + '/api/shows/' + id)
	.then((response) => {
		console.log('api::getShowById success', response.data);
		cb(response.data);
	})
	.catch((err) => {
		console.error('api::getShowById error', err);
	})
};

export function getFullShow(id, cb) {
	
	axios.get(API_URL + '/api/shows/' + id)
	.then((response) => {
		console.log('api::getFullShow success', response.data);
		cb(response.data);
	})
	.catch((err) => {
		console.error('api::getFullShow error', err);
	})
};

export function getTeasers(media_type, ids, cb) {
	
	axios.post(API_URL + '/api/teasers/' + media_type, {ids})
	.then((response) => {
		console.log('api::getTeasers success', response.data);
		cb(response.data);
	})
	.catch((err) => {
		console.error('api::getTeasers error', err);
	})
}
