import { EVMBlockchain } from './EVMBlockchain'

export class Optimism extends EVMBlockchain {
	api_url = 'https://api-optimistic.etherscan.io/api'

	constructor(api_url = 'https://api-optimistic.etherscan.io/api') {
		if (process.env.OPTIMISMSCAN_API_KEY === undefined) throw new Error('Missing OPTIMISMSCAN_API_KEY in .env file')
		super(api_url, process.env.OPTIMISMSCAN_API_KEY)

		console.log('Optimism', this.api_url, this.api_key)
	}
}
