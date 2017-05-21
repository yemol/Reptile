import axios from 'axios'
import cheerio from 'cheerio'
import config from '../config'
import tools from './tools'
import WatchArray from './watchedList'

// this is a internal cache used to save items need to be checked
let cached = new WatchArray()
// this is a list used to save items has been operated and we can release them to next step
let processed = new WatchArray()
// This is place we used to save all processed items.
// We use this array to make sure we will not check save item more than once.
let checked = []

exports.finished = () => {
	return cached.isEmpty() && processed.isEmpty()
}

exports.start = (url, callback) => {
	// Push first url into list
	cached.push(url)
	// We need to init watchedList before we can use it.
	// We need to define callback method in init progress.
	cached.start(fetchLink)
	// processed.start(callback)
	keepalive()
}

function keepalive () {
	if (!(cached.isEmpty() && processed.isEmpty())) {
		setTimeout(keepalive, 100)
	}
}

function fetchLink () {
	let url = cached.pop()
	// We need to check if current item is a duplicate item.
	if (tools.contains(checked, url)) {
		return
	}
	console.log(url)
	var instance = axios.create({
		timeout: 100000,
		headers: {
			'User-Agent': config.UserAgent,
			'Accept-Language': 'zh-CN,zh;q=0.8'
		}
	})
	instance.get(url)
	.then(function (response) {
		if (response.status === 200) {
			let dom = cheerio.load(response.data)
			dom('a').each((index, element) => {
				// search by text
				if (tools.contains(config.links.text, dom(element).text())) {
					cached.push(config.url + element.attribs.href)
				}
				// search by class
				if (tools.contains(config.links.class, element.attribs.class)) {
					cached.push(config.url + element.attribs.href)
				}
			})
		}
		console.log(url)
		// We need to save processed item in checked list here to provent it from being chekced again.
		checked.push(url)
		processed.push(url)
	})
	.catch(function (error) {
		console.log(error)
		cached.push(url)
	})
}
