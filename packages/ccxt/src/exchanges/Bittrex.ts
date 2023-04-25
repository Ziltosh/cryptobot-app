import { config } from 'dotenv-mono'
import { Exchange } from 'ccxt'
import { CcxtExchange } from './CcxtExchange'

config() // Take environment variables from .env

export class Bittrex extends CcxtExchange {
	private instance: Exchange
	constructor() {
		super()
		this.instance = CcxtExchange.getInstance('bittrex')
	}

	protected getSymbol(token: string, currency: string): string {
		if (currency === 'USD') return `${token}-USD`
		else return `${token}-${currency}`
	}
}
