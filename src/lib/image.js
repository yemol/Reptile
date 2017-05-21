import axios from 'axios'
import cheerio from 'cheerio'
import config from '../config'
import tools from './tools'

import fs from 'fs'
import path from 'path'
import request from 'request'

let before = null
// images that we need to download
const cachedImages = []
// images that we have downloaded
const savedImages = []
// this is used to save all urls that we have processed. The urls in this list will be send to next processor.
const processed = []
exports.processed = processed

exports.start = (base) => {
	before = base
	goDownload()
}

function downloadImage (url, name) {
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

// To download images from page
function goDownload () {
	let url = before.processed.pop()
	// We need to loop the processor if we do not get any item to check in this round.
	if (url === null || url === undefined) {
		setTimeout(goDownload, 100)
		return
	}
	console.log('download images from [' + url + ']')
	var instance = axios.create({
		timeout: 100000,
		headers: {
			'User-Agent': config.UserAgent,
			'Accept-Language': config.acceptLanguage
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
					console.log(imgUrl + '|' + element.attribs.alt)
					cachedImages.unshift({url: imgUrl, alt: element.attribs.alt})
					console.log('cachedImages length = ' + cachedImages.length)
				}
			})
		}
		// handle processed url to next processor
		processed.unshift(url)
		// start a new loop
		setTimeout(goDownload, 100)
	})
	.catch(function (error) {
		console.log(error)
	})
}
