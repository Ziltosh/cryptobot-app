import { EVMBlockchain } from './EVMBlockchain'

export class Arbitrumone extends EVMBlockchain {
	api_url = 'https://api.arbiscan.io/api'

	constructor(api_url = 'https://api.arbiscan.io/api') {
		if (process.env.ARBITRUMONESCAN_API_KEY === undefined)
			throw new Error('Missing ARBITRUMONESCAN_API_KEY in .env file')
		super(api_url, process.env.ARBITRUMONESCAN_API_KEY)

		console.log('Arbitrum One', this.api_url, this.api_key)
	}
}
