import {config} from 'dotenv-mono'
import {Exchange} from 'ccxt'
import {CcxtExchange} from './CcxtExchange'

config() // Take environment variables from .env

export class Kraken extends CcxtExchange {
	//@ts-ignore utilisé dans CcxtExchange, ne pas supprimer
	private instance: Exchange

	// Historique limité à 720 bougies
	public ohlcvHistory = false

	constructor() {
		super()
		this.instance = CcxtExchange.getInstance('kraken')
	}

	public async getPriceAtDate(_token: string, _currency: string, _date: Date): Promise<number | null> {
		return null
	}

	protected getSymbol(token: string, currency: string): string {
		if (token === 'BTC') token = `XBT`
		if (currency === 'USD') currency = `USDT`
		return `${token}${currency}`
	}
}
