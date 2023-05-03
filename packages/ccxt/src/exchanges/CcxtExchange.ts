import ccxt, { BaseError, Currency, Dictionary, Exchange, Market, PartialBalances, Trade, Transaction } from "ccxt";

export abstract class CcxtExchange {
	protected static instance: Exchange

	public ohlcvHistory = true

	static getInstance(exchangeId: string): Exchange {
		if (!CcxtExchange.instance || CcxtExchange.instance.id !== exchangeId) {
			//@ts-ignore
			CcxtExchange.instance = new ccxt[exchangeId]()
		}

		return CcxtExchange.instance
	}

	public async getPriceAtDate(token: string, currency: string, date: Date): Promise<number | null> {
		console.log('getPriceAtDate > token', token, 'currency', currency, 'date', date)
		try {
			const symbol = this.getSymbol(token, currency)
			const ohlcvs = await CcxtExchange.instance.fetchOHLCV(symbol, '5m', date.getTime(), 1)
			console.log('ohlcvs', ohlcvs, 'symbol', symbol, 'date', date)
			if (!this._checkTimestamp(ohlcvs[0][0], date.getTime())) return null
			return ohlcvs[0][3]
		} catch (error: BaseError | any) {
			console.log('instance', CcxtExchange.instance.id, (error as BaseError).message)
			return null
		}
	}

	private _checkTimestamp(ohlcvTimestamp: number, targetTimestamp: number): boolean {
		// On vérifie que le timestamp est bien dans l'intervalle de 5 minutes
		const diff = Math.abs(ohlcvTimestamp - targetTimestamp)
		return diff < 5 * 60 * 1000
	}

	protected getSymbol(token: string, currency: string): string {
		if (currency === 'USD') return `${token}USD`
		else return `${token}${currency}`
	}

	public async loadMarkets(): Promise<Dictionary<Market>> {
		return CcxtExchange.instance.loadMarkets()
	}

	public async getCurrencies(): Promise<Dictionary<Currency>> {
		await this.loadMarkets()
		return CcxtExchange.instance.currencies
	}

	public async getSymbols(): Promise<string[]> {
		await this.loadMarkets()
		return CcxtExchange.instance.symbols
	}

	protected fetchDeposits? = async (_credentials: {
		apiKey: string
		secret: string
		phrase: string
	}): Promise<Transaction[] | null> => {
		return null
	}

	protected fetchWithdrawals? = async (_credentials: {
		apiKey: string
		secret: string
		phrase: string
	}): Promise<Transaction[] | null> => {
		return null
	}

	protected fetchMyTrades? = async (_credentials: {
		apiKey: string
		secret: string
		phrase: string
	}): Promise<Trade[] | null> => {
		return null
	}

	public fetchBalances = async (credentials: {
		apiKey: string
		secret: string
		phrase: string
	}): Promise<PartialBalances | null> => {
		if (CcxtExchange.instance.has['fetchBalance']) {
			CcxtExchange.instance.apiKey = credentials.apiKey
			CcxtExchange.instance.secret = credentials.secret
			CcxtExchange.instance.password = credentials.phrase

			CcxtExchange.instance.checkRequiredCredentials()

			const balance = await CcxtExchange.instance.fetchBalance()
			return balance['total'] as unknown as PartialBalances
		}
		return null
	}

	protected getCurrencyOfDeposit? = (deposit: Transaction): string => {
		return deposit.currency
	}
}
