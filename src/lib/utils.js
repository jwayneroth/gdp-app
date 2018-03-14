/**
 * return copy of array with el at idx removed
 */
export const sliceIndex = function(arr, idx) {
	const copy = arr.slice();
	copy.splice(idx, 1);
	return copy;
}

/**
 * convert array of objects to array of values for <key>
 * [{ <key>: 333, title: "foo" }] => [333]
 */
export const flattenObjectArray = function(arr, key) {
	return arr.reduce((res, val) => {
		if (val[key]) res.push(val.id);
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
