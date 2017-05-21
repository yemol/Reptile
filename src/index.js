import base from './lib/base'
import image from './lib/image'
import config from './config'

base.start(config.url + config.path, () => {
	// image.start(base)
})
