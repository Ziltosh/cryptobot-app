import { EVMBlockchain } from './EVMBlockchain'

export class Cronos extends EVMBlockchain {
	api_url = 'https://api.cronoscan.com/api'

	constructor(api_url = 'https://api.cronoscan.com/api') {
		if (process.env.CRONOSSCAN_API_KEY === undefined) throw new Error('Missing CRONOSSCAN_API_KEY in .env file')
		super(api_url, process.env.CRONOSSCAN_API_KEY)

		console.log('Cronos', this.api_url, this.api_key)
	}
}
