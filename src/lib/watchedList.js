
export default class WatchedList {
	constructor () {
		console.log('constructor')
		// this is a internal cache used to save items
		// we will watch on this list with certain loop to check if there is new item in it
		this.savedList = []
		this.callback = null
		this.stoped = false
	}

	start (watch) {
		this.callback = watch
		setTimeout(this.overwatch, 50)
	}

	overwatch () {
		if (this.savedList && this.savedList.length > 0) {
			if (this.callback !== null || this.callback !== undefined) this.callback()
		}
		if (!this.stoped) {
			console.log('new loop')
			setTimeout(this.overwatch, 50)
		}
	}

	isEmpty () {
		return this.savedList.length === 0
	}

	stop () {
		this.stoped = true
	}

	push (item) {
		this.savedList.unshift(item)
		// if (callback !== null || callback !== undefined) callback(savedList)
	}

	pop () {
		return this.savedList.pop()
	}
}
