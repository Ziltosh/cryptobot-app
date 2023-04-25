import { EVMBlockchain } from './EVMBlockchain'

export class Bsc extends EVMBlockchain {
	api_url = 'https://api.bscscan.com/api'

	constructor(api_url = 'https://api.bscscan.com/api') {
		if (process.env.BSCSCAN_API_KEY === undefined) throw new Error('Missing BSCSCAN_API_KEY in .env file')
		super(api_url, process.env.BSCSCAN_API_KEY)

		console.log('BSC', this.api_url, this.api_key)
	}
}
