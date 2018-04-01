/**
 * return copy of array with el at idx removed
 */
export const sliceIndex = function(arr, idx) {
	const copy = arr.slice();
	copy.splice(idx, 1);
	return copy;
}

/**
 * return copy of array with el removed
 */
export const sliceElement = function(arr, el) {
	const idx = arr.indexOf(el);
	if (idx !== -1) return sliceIndex(arr, idx);
	return arr.slice();
}

/**
 * convert array of objects to array of values for <key>
 * [{ <key>: 333, title: "foo" }] => [333]
 */
export const flattenObjectArray = function(arr, key) {
	return arr.reduce((res, val) => {
		if (val[key]) res.push(val[key]);
		return res;
	}, []);
}

/**
 * convert array of objects to object keyed by <key>
 * [{ id: 333, title: "foo" }] => { 333: { title: "foo" }}
 */
export const arrayToObject = (arr, key) => {
	return Object.assign(
		{},
		...arr.map(item => ({[item[key]]: item}))
	);
}

/**
 * convert array of objects to array of values for <key>
 * [{ id: 333, title: "foo", subArray: [<key>: 42}] }] => [42]
 */
export const flattenObjectArraySubArray = function(arr, sub, key) {
	return arr.reduce((res, val) => {
		if (val[sub] && val[sub].constructor === Array) {
			val[sub].forEach(item => {
				if (item[key]) res.push(item[key]);
			})
		}
		return res;
	}, []);
}
