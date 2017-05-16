import axios from 'axios'
import cheerio from 'cheerio'

axios.get('https://shadowverse-portal.com/cards')
.then(function (response) {
	let dom = cheerio.load(response.data)
	dom('img').each((index, element) => {
		console.log(element.attribs.src)
	})
})
.catch(function (error) {
	console.log(error)
})
