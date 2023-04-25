import { config } from 'dotenv-mono'
import { Exchange } from 'ccxt'
import { CcxtExchange } from './CcxtExchange'

config() // Take environment variables from .env

export class Poloniex extends CcxtExchange {
	private instance: Exchange

	// Historique limité à 200 bougies
	public ohlcvHistory = false

	constructor() {
		super()
		this.instance = CcxtExchange.getInstance('poloniex')
	}

	public async getPriceAtDate(_token: string, _currency: string, _date: Date): Promise<number | null> {
		return null
	}

	protected getSymbol(token: string, currency: string): string {
		if (currency === 'USD') return `${token}_USDT`
		else return `${token}_${currency}`
	}
}
