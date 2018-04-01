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

export function deleteList(id) {
	return new Promise((resolve, reject) => {
		axios.post(API_URL + '/api/lists/delete/' + id)
		.then((response) => {
			console.log('api::deleteList success', response.data);
			resolve(response.data);
		})
		.catch((err) => {
			console.log('api::deleteList error', err.response.data);
			reject(err.response.data);
		});
	});
}

/**
 * get complete List Object with related shows, recordings, track teasers
 * resolves with list (OBJECT) or rejects with error (STRING)
 */
export function getFullList(id) {
	return new Promise((resolve, reject) => {
		axios.get(API_URL + '/api/lists/' + id)
		.then((response) => {
			console.log('api::getFullList success', response.data);
			resolve(response.data);
		})
		.catch((err) => {
			console.log('api::getFullList error', err.response.data);
			reject(err.response.data);
		});
	});
}

/**
 * updateList - called to add media item AND/OR  set title
 * resolves with status (STRING) or rejects with error (STRING)
 */
export function updateList(listId, vals) {
	console.log('api::updateList', vals);
	return new Promise((resolve, reject) => {
		axios.put(API_URL + '/api/lists/' + listId, vals)
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

/**
 * get lists for media item
 */
export function getMediaLists(type, id) {
	return new Promise((resolve, reject) => {
		axios.get(API_URL + '/api/lists/media/' + type + '/' + id)
		.then((response) => {
			console.log('api::getMediaLists success', response.data);
			resolve(response.data);
		})
		.catch((err) => {
			console.log('api::getMediaLists error', err.response.data);
			reject(err.response.data);
		});
	});
}



