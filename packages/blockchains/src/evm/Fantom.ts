import { EVMBlockchain } from './EVMBlockchain'

export class Fantom extends EVMBlockchain {
	api_url = 'https://api.ftmscan.com/api'

	constructor(api_url = 'https://api.ftmscan.com/api') {
		if (process.env.FANTOMSCAN_API_KEY === undefined) throw new Error('Missing FANTOMSCAN_API_KEY in .env file')
		super(api_url, process.env.FANTOMSCAN_API_KEY)

		console.log('Fantom', this.api_url, this.api_key)
	}
}
