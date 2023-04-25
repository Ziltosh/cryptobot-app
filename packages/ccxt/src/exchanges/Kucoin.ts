import { config } from 'dotenv-mono'
import { Exchange } from 'ccxt'
import { CcxtExchange } from './CcxtExchange'

config() // Take environment variables from .env

export class Kucoin extends CcxtExchange {
	private instance: Exchange
	constructor() {
		super()
		this.instance = CcxtExchange.getInstance('kucoin')
	}

	protected getSymbol(token: string, currency: string): string {
		if (currency === 'USD') return `${token}-USDT`
		else return `${token}-${currency}`
	}
}
