import {axios, API_URL} from './';

/**
 * saveNewList
 * resolves with id (NUMBER) or rejects with error (STRING)
 */
export function saveNewList(vals) {
	return new Promise((resolve, reject) => {
		axios.post(API_URL + '/api/lists', vals)
		.then((response) => {
			console.log('api::saveNewList success', response.data);
			resolve(response.data);
		})
		.catch((err) => {
			console.log('api::saveNewList error', err.response.data);
			reject(err.response.data);
		});
	});
}

/**
 * getList
 * resolves with list (OBJECT) or rejects with error (STRING)
 */
export function getList(id) {
	return new Promise((resolve, reject) => {
		axios.get(API_URL + '/api/lists/' + id)
		.then((response) => {
			console.log('api::getList success', response.data);
			resolve(response.data);
		})
		.catch((err) => {
			console.log('api::getList error', err.response.data);
			reject(err.response.data);
		});
	});
}

/**
 * updateList
 * resolves with status (STRING) or rejects with error (STRING)
 */
export function updateList(list) {
	return new Promise((resolve, reject) => {
		axios.put(API_URL + '/api/lists/' + list.id, list)
		.then((response) => {
			console.log('api::updateList success', response.data);
			resolve('success');
		})
		.catch((err) => {
			console.log('api::updateList error', err.response.data);
			reject(err.response.data);
		});
	});
}




