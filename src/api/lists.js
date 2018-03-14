import {axios, API_URL} from './';

/**
 * saveNewList
 * resolves with id (NUMBER) or rejects with error (STRING)
 */
export function saveNewList(list) {
	return new Promise((resolve, reject) => {
		axios.post(API_URL + '/lists', list)
		.then((response) => {
			console.log('api::saveNewList success', response.data);
			resolve(response.data);
		})
		.catch((err) => {
			console.log('api::saveNewList error', err.response.data);
			reject(parseResponseErrors(err.response.data, 'We experienced an error saving your list. Please try again later.'));
		});
	});
}

/**
 * getList
 * resolves with list (OBJECT) or rejects with error (STRING)
 */
export function getList(id) {
	return new Promise((resolve, reject) => {
		axios.get(API_URL + '/lists/' + id)
		.then((response) => {
			console.log('api::getList success', response.data);
			resolve(response.data);
		})
		.catch((err) => {
			console.log('api::getList error', err.response.data);
			reject('We experienced an error loading your list. Please try again later.');
		});
	});
}

/**
 * updateList
 * resolves with status (STRING) or rejects with error (STRING)
 */
export function updateList(list) {
	return new Promise((resolve, reject) => {
		axios.put(API_URL + '/lists/' + list.id, list)
		.then((response) => {
			console.log('api::updateList success', response.data);
			resolve('success');
		})
		.catch((err) => {
			console.log('api::updateList error', err.response.data);
			reject(parseResponseErrors(err.response.data, 'We experienced an error saving your list. Please try again later.'));
		});
	});
}




