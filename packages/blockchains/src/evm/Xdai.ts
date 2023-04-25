import { EVMBlockchain } from './EVMBlockchain'

export class Xdai extends EVMBlockchain {
	api_url = 'https://api.gnosisscan.io/api'

	constructor(api_url = 'https://api.gnosisscan.io/api') {
		if (process.env.XDDAISCAN_API_KEY === undefined) throw new Error('Missing XDDAISCAN_API_KEY in .env file')
		super(api_url, process.env.XDDAISCAN_API_KEY)

		console.log('xDai', this.api_url, this.api_key)
	}
}
