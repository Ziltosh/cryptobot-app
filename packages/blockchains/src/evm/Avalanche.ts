import { EVMBlockchain } from './EVMBlockchain'

export class Avalanche extends EVMBlockchain {
	api_url = 'https://api.snowtrace.io/api'

	constructor(api_url = 'https://api.snowtrace.io/api') {
		if (process.env.AVALANCHESCAN_API_KEY === undefined)
			throw new Error('Missing AVALANCHESCAN_API_KEY in .env file')
		super(api_url, process.env.AVALANCHESCAN_API_KEY)

		console.log('Avalanche', this.api_url, this.api_key)
	}
}
