import { EVMBlockchain } from './EVMBlockchain'

export class Arbitrumnova extends EVMBlockchain {
	api_url = 'https://api-nova.arbiscan.io/api'

	constructor(api_url = 'https://api-nova.arbiscan.io/api') {
		if (process.env.ARBITRUMNOVASCAN_API_KEY === undefined)
			throw new Error('Missing ARBITRUMNOVASCAN_API_KEY in .env file')
		super(api_url, process.env.ARBITRUMNOVASCAN_API_KEY)

		console.log('Arbitrum Nova', this.api_url, this.api_key)
	}
}
