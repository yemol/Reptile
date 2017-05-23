import axios from 'axios'
import cheerio from 'cheerio'
import config from '../config'
import tools from './tools'

import fs from 'fs'
import path from 'path'
import request from 'request'

// images that we need to download
const cached = []
const savedPath = path.join(__dirname, '../../' + config.savePath)

exports.finished = () => {
	return cachedImages.length === 0
}

// To download images from page
exports.start = (url) => {
	console.log('get text from [' + url + ']')
	if (!fs.existsSync(savedPath)) {
		fs.mkdirSync(savedPath)
	}
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
			dom('div').each((index, element) => {
				// search by class
				if (tools.contains(config.text.class, element.attribs.class)) {
					let regRN = /\n+/g
					let output = dom(element).text().replace(/\n+/g,'\r\n')
					let fileName = path.join(savedPath, url.substr(url.lastIndexOf('/')) + '.txt')
					// we will skip the image if it has been downloaded
					if (fs.existsSync(fileName)) { return }
					// output = output.replace(/\r+/g,'[r]')
					fs.writeFile(fileName, output, (err) => {
        		console.log('text saved!')
    			})
					fs.close
				}
			})

		}
	})
	.catch(function (error) {
		console.log(error)
	})
}
