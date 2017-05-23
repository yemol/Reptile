import base from './lib/base'
import image from './lib/image'
import text from './lib/text'
import config from './config'

base.start(config.url + config.path, (item) => {
	image.start(item)
	text.start(item)
})
