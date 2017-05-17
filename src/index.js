import base from './lib/base'
import config from './config'

const cachedLinks = []
const savedLinks = []
let allPageFound = false

// save start point in array
cachedLinks.unshift(config.url + config.path)

function checkLink () {
	// do more search in saved links
	let current = cachedLinks.pop()
	if (current && current !== null && !base.contains(savedLinks, current)) {
		savedLinks.push(current)
		base.fetchLink(current, (links) => {
			var i = links.length
			while (i--) {
				cachedLinks.unshift(config.url + links[i])
			}
			setTimeout(checkLink, 50)
		})
	} else if (cachedLinks.length > 0) {
		setTimeout(checkLink, 50)
	} else {
		allPageFound = true
		console.log('all pages have been found.')
	}
}

function downloadImg () {
	if (savedLinks.length > 0) {
		let newOne = savedLinks.pop()
		base.downloadImage(newOne)
		setTimeout(downloadImg, 1000)
	} else if (!allPageFound) {
		setTimeout(downloadImg, 1000)
	}
}

checkLink()
downloadImg()
