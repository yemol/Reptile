import axios from 'axios'
import cheerio from 'cheerio'
import config from '../config'

import fs from 'fs'
import path from 'path'
import request from 'request'

function contains (arr, obj) {
	var i = arr.length
	while (i--) {
		if (arr[i] === obj) {
			return true
		}
	}
	return false
}

function downloadOneImage (url, name) {
	let savedPath = path.join(__dirname, '../../' + config.savePath)
	let fileName = path.join(savedPath, name + '.png')
	if (!fs.existsSync(savedPath)) {
		fs.mkdirSync(savedPath)
	}
	// we will skip the image if it has been downloaded
	if (fs.existsSync(fileName)) { return }
	// start downloading image
	request.head(url, () => {
		request(url).pipe(fs.createWriteStream(fileName))
	})
}

exports.contains = contains
function partlyContains (arr, obj) {
	if (obj === undefined) return false
	var i = arr.length
	while (i--) {
		if (obj.indexOf(arr[i]) >= 0) {
			return true
		}
	}
	return false
}

exports.fetchLink = (url, callback) => {
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
			let links = []
			let dom = cheerio.load(response.data)
			dom('a').each((index, element) => {
				// search by text
				if (contains(config.links.text, dom(element).text())) {
					links.push(element.attribs.href)
				}
				// search by class
				if (contains(config.links.class, element.attribs.class)) {
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

// To download images from page
exports.downloadImage = (url) => {
	console.log('download images from [' + url + ']')
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
			dom('img').each((index, element) => {
				// search download image by it's class
				// we will check both src and data-src attribute for lazy downlaod supported pages.
				if (partlyContains(config.imagePattern, element.attribs['data-src']) || partlyContains(config.imagePattern, element.attribs['src'])) {
					let imgUrl = element.attribs.src === undefined || element.attribs.src.length === 0 ? element.attribs['data-src'] : element.attribs.src
					console.log(imgUrl + '|' + element.attribs.alt)
					setTimeout(() => { downloadOneImage(imgUrl, element.attribs.alt) }, 1000)
					// console.log(element.attribs.src + '|' + element.attribs.src === undefined)
				}
			})
		}
	})
	.catch(function (error) {
		console.log(error)
		return false
	})
}
