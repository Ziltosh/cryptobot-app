import { config } from 'dotenv-mono'
import { Exchange, PartialBalances } from 'ccxt'
import { CcxtExchange } from './CcxtExchange'

config() // Take environment variables from .env

export class Bybit extends CcxtExchange {
	private instance: Exchange
	constructor() {
		super()
		this.instance = CcxtExchange.getInstance('bybit')
	}

	fetchBalances = async (credentials: {
		apiKey: string
		secret: string
		phrase: string
	}): Promise<PartialBalances | null> => {
		if (this.instance.has['fetchBalance']) {
			this.instance.apiKey = credentials.apiKey
			this.instance.secret = credentials.secret
			this.instance.password = credentials.phrase
			this.instance.checkRequiredCredentials()

			this.instance.options['defaultType'] = 'spot'
			const spot = await this.instance.fetchTotalBalance()

			this.instance.options['defaultType'] = 'future'
			const future = await this.instance.fetchTotalBalance()

			console.log(spot)
			console.log('------')
			console.log(future)

			let balances: PartialBalances = {}

			for (const token of Object.keys(spot)) {
				// @ts-ignore
				balances[token] = (balances[token] || 0) + spot[token]
			}

			for (const token of Object.keys(future)) {
				// @ts-ignore
				balances[token] = (balances[token] || 0) + future[token]
			}

			return balances
		}
		return null
	}
}
