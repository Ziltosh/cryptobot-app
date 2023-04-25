import { config } from 'dotenv-mono'

import { Exchange } from 'ccxt'
import { CcxtExchange } from './CcxtExchange'

config() // Take environment variables from .env

export class Bitfinex2 extends CcxtExchange {
	private instance: Exchange
	constructor() {
		super()
		this.instance = CcxtExchange.getInstance('bitfinex2')
	}

	protected getSymbol(token: string, currency: string): string {
		return `t${token}${currency}`
	}
}
