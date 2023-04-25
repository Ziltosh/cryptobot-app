import { config } from 'dotenv-mono'
import { Exchange } from 'ccxt'
import { CcxtExchange } from './CcxtExchange'

config() // Take environment variables from .env

export class Gateio extends CcxtExchange {
	private instance: Exchange
	constructor() {
		super()
		this.instance = CcxtExchange.getInstance('gateio')
	}

	protected getSymbol(token: string, currency: string): string {
		if (currency === 'USD') return `${token}_USDT`
		else return `${token}_${currency}`
	}
}
