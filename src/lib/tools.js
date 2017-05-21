exports.contains = (arr, obj) => {
	var i = arr.length
	while (i--) {
		if (arr[i] === obj) {
			return true
		}
	}
	return false
}

exports.partlyContains = (arr, obj) => {
	if (obj === undefined) return false
	var i = arr.length
	while (i--) {
		if (obj.indexOf(arr[i]) >= 0) {
			return true
		}
	}
	return false
}
