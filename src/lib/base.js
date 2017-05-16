import axios from 'axios'
import cheerio from 'cheerio'
import config from '../config'

function contains (arr, obj) {
	var i = arr.length
	while (i--) {
		if (arr[i] === obj) {
			return true
		}
	}
	return false
}
exports.contains = contains

exports.fetchLink = (url, callback) => {
	let instance = axios.create({
		baseURL: url,
		timeout: 10000,
		headers: {
			'User-Agent': config.UserAgent,
			'Accept-Language': 'zh-CN,zh;q=0.8'
		}
	})
	instance.get(url, {
		headers: {
			'User-Agent': config.UserAgent,
			'Accept-Language': 'zh-CN,zh;q=0.8'
		}
	})
	.then(function (response) {
		if (response.status === 200) {
			let links = []
			let dom = cheerio.load(response.data)
			dom('a').each((index, element) => {
				if (contains(config.links, dom(element).text())) {
					links.push(element.attribs.href)
				}
			})
			callback(links)
		} else {
			callback(null)
		}
		return true
	})
	.catch(function (error) {
		console.log(error)
		return false
	})
}
