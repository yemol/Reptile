
export default class WatchedList {
	constructor (watch) {
		// this is a internal cache used to save items
		// we will watch on this list with certain loop to check if there is new item in it
		this.savedList = []
		this.callback = watch
	}

	isEmpty () {
		return this.savedList.length === 0
	}

	push (item) {
		this.savedList.unshift(item)
		if (this.callback !== null || this.callback !== undefined) this.callback(item)
	}

	pop () {
		return this.savedList.pop()
	}

	contains (obj) {
		var i = this.savedList.length
		while (i--) {
			if (this.savedList[i] === obj) {
				return true
			}
		}
		return false
	}

	partlyContains (obj) {
		if (obj === undefined) return false
		var i = this.savedList.length
		while (i--) {
			if (obj.indexOf(this.savedList[i]) >= 0) {
				return true
			}
		}
		return false
	}
}
