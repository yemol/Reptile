import axios from 'axios'
import cheerio from 'cheerio'
import config from '../config'
import tools from './tools'
import WatchArray from './watchedList'

// this is a internal cache used to save items need to be checked
let cached = []
// this is a list used to save items has been operated and we can release them to next step
let processed = null

exports.finished = () => {
	return cached.length === 0
}

exports.start = (url, callback) => {
	// Push first url into list
	cached.push(url)
	// We need to init watchedList before we can use it.
	// We need to define callback method in init progress.
	processed = new WatchArray(callback)
	fetchLink()
}

function fetchLink () {
	let url = cached.pop()
	// We need to check if current item is a duplicate item.
	while (processed.contains(url)) {
		url = cached.pop()
	}
	var instance = axios.create({
		timeout: 100000,
		headers: {
			'User-Agent': config.UserAgent,
			'Accept-Language': 'zh-CN,zh;q=0.8',
			'Cookie': config.Cookie
		}
	})
	instance.get(url)
	.then(function (response) {
		if (response.status === 200) {
			let dom = cheerio.load(response.data)
			dom('a').each((index, element) => {
				// search by text
				if (tools.contains(config.links.text, dom(element).text())) {
					cached.unshift(config.url + element.attribs.href)
				}
				// search by class
				if (tools.contains(config.links.class, element.attribs.class)) {
					cached.unshift(config.url + element.attribs.href)
				}
			})
		}
		// handle it to next step
		processed.push(url)
		if (cached.length > 0) setTimeout(fetchLink, 50)
	})
	.catch(function (error) {
		console.log(error)
		// We need to check this url again.
		cached.unshift(url)
		// Starting a new loop
		setTimeout(fetchLink, 50)
	})
}
