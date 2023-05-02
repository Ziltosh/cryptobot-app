import { config } from "dotenv-mono";
import { Exchange } from "ccxt";
import { CcxtExchange } from "./CcxtExchange";

config() // Take environment variables from .env

export class Bitstamp extends CcxtExchange {
	// @ts-ignore
	private instance: Exchange
	constructor() {
		super()
		this.instance = CcxtExchange.getInstance('bitstamp')
	}

	protected getSymbol(token: string, currency: string): string {
		if (currency === 'USD') return `${token}/USD`
		else return `${token}/${currency}`
	}
}
