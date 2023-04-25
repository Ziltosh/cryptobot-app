import { EVMBlockchain } from './EVMBlockchain'

export class Ethereum extends EVMBlockchain {
	api_url = 'https://api.etherscan.io/api'

	constructor(api_url = 'https://api.etherscan.io/api') {
		if (process.env.ETHERSCAN_API_KEY === undefined) throw new Error('Missing ETHERSCAN_API_KEY in .env file')
		super(api_url, process.env.ETHERSCAN_API_KEY)

		console.log('Ethereum', this.api_url, this.api_key)
	}
}
