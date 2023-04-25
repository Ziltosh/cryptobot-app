import {config} from 'dotenv-mono'
import {Exchange} from 'ccxt'
import {CcxtExchange} from './CcxtExchange'

config() // Take environment variables from .env

export class Bitget extends CcxtExchange {
	//@ts-ignore utilisé dans CcxtExchange, ne pas supprimer
	private instance: Exchange

	public ohlcvHistory = false
	constructor() {
		super()
		this.instance = CcxtExchange.getInstance('bitget')
	}

	async getPriceAtDate(_token: string, _currency: string, _date: Date): Promise<number | null> {
		return null
	}

	protected getSymbol(token: string, currency: string): string {
		if (currency === 'USD') return `${token}USDT_SPBL`
		else return `${token}${currency}_SPBL`
	}
}
