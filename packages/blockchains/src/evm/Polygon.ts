import { EVMBlockchain } from './EVMBlockchain'

export class Polygon extends EVMBlockchain {
	api_url = 'https://api.polygonscan.com/api'

	constructor(api_url = 'https://api.polygonscan.com/api') {
		if (process.env.POLYGONSCAN_API_KEY === undefined) throw new Error('Missing POLYGONSCAN_API_KEY in .env file')
		super(api_url, process.env.POLYGONSCAN_API_KEY)

		console.log('Polygon', this.api_url, this.api_key)
	}
}
