import base from './lib/base'

const url = 'https://shadowverse-portal.com'
const path = '/cards'
const cachedLinks = []
const savedLinks = []

// save start point in array
cachedLinks.unshift(url + path)

function checkLink () {
	// do more search in saved links
	let current = cachedLinks.pop()
	if (current && current !== null && !base.contains(savedLinks, current)) {
		savedLinks.push(current)
		console.log('fetchLink = ' + current)
		base.fetchLink(current, (links) => {
			var i = links.length
			while (i--) {
				cachedLinks.unshift(url + links[i])
			}
			setTimeout(checkLink, 50)
		})
	} else if (cachedLinks.length > 0) {
		setTimeout(checkLink, 50)
	} else {
		console.log(savedLinks)
	}
}
checkLink()
