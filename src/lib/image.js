import axios from 'axios'
import cheerio from 'cheerio'
import config from '../config'
import tools from './tools'

import fs from 'fs'
import path from 'path'
import request from 'request'

// images that we need to download
const cachedImages = []
const savedPath = path.join(__dirname, '../../' + config.savePath)
let startDownloading = false

function downloadImage () {
	startDownloading = !startDownloading
	let current = cachedImages.pop()
	// format of filename will be id_name.png
	let fileName = current.url.substr(current.url.lastIndexOf('/'))
	fileName = fileName.substr(0, fileName.lastIndexOf('.') + 4)
	fileName = fileName.replace('.', '__' + current.alt + '.')
	fileName = path.join(savedPath, fileName)
	if (!fs.existsSync(savedPath)) {
		fs.mkdirSync(savedPath)
	}
	// we will skip the image if it has been downloaded
	if (fs.existsSync(fileName)) { return }
	// start downloading image
	request.head(current.url, () => {
		request(current.url).pipe(fs.createWriteStream(fileName))
		if (cachedImages.length > 0) setTimeout(downloadImage, 50)
		console.log('download image: ' + current.url)
	})
}

exports.finished = () => {
	console.log(cachedImages.length)
	return cachedImages.length === 0
}

// To download images from page
exports.start = (url) => {
	console.log('get images from [' + url + ']')
	var instance = axios.create({
		timeout: 100000,
		headers: {
			'User-Agent': config.UserAgent,
			'Accept-Language': config.acceptLanguage,
			'Cookie': config.Cookie
		}
	})
	instance.get(url)
	.then(function (response) {
		if (response.status === 200) {
			let dom = cheerio.load(response.data)
			dom('img').each((index, element) => {
				// search download image by it's class
				// we will check both src and data-src attribute for lazy downlaod supported pages.
				if (tools.partlyContains(config.imagePattern, element.attribs['data-src']) || tools.partlyContains(config.imagePattern, element.attribs['src'])) {
					let imgUrl = element.attribs.src === undefined || element.attribs.src.length === 0 ? element.attribs['data-src'] : element.attribs.src
					cachedImages.unshift({url: imgUrl, alt: element.attribs.alt})
				}
			})
		}
		// start downloading images that we marked
		if (cachedImages.length > 0) setTimeout(downloadImage, 50)
	})
	.catch(function (error) {
		console.log(error)
	})
}
