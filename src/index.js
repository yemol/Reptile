import base from './lib/base'
import image from './lib/image'
import config from './config'

// function sleep (ms) {
// 	return new Promise(resolve => setTimeout(resolve, ms))
// }

base.start(config.url + config.path, (item) => {
	image.start(item)
})

// while (!base.finished || !image.finished) {
// 	console.log(base.finished)
// 	sleep(5000)
// }
