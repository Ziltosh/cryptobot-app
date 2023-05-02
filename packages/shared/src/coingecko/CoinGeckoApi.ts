import axios, { AxiosError, AxiosInstance } from "axios";
import {
	CoingeckoBlockchainsListResponse,
	CoingeckoCoin,
	CoingeckoCoinHistory,
	CoingeckoCoinListResponse,
	CoingeckoCoinMarketsResponse,
	CoingeckoCoinTickersListResponse,
	CoingeckoExchangeListResponse,
	CoingeckoPingResponse
} from "./Coingecko.types";
import * as https from "https";
import { config } from "dotenv-mono";
import * as process from "process";

config()

export class CoinGeckoApi {
	private readonly url: string
	private maxRequestsPerMinute = 13
	private readonly instance: AxiosInstance
	constructor(url = 'https://api.coingecko.com/api/v3', withProxy = false) {
		this.url = url
		if (!withProxy) {
			this.instance = axios.create({
				baseURL: this.url,
			})
		} else {
			this.instance = axios.create({
				baseURL: this.url,
				httpsAgent: new https.Agent({
					rejectUnauthorized: false,
				}),
				proxy: {
					host: 'zproxy.lum-superproxy.io',
					port: 22225,
					protocol: 'https',
					auth: {
						username: process.env.PROXY_USERNAME || '',
						password: process.env.PROXY_PASSWORD || '',
					},
				},
			})
			this.maxRequestsPerMinute = 60
		}
	}

	async ping(): Promise<CoingeckoPingResponse> {
		const response = await this._request<CoingeckoPingResponse | 404>(`/ping`, 'get')

		if (response) {
			return { gecko_says: '' }
		}

		return response
	}

	async coinsList(): Promise<CoingeckoCoinListResponse> {
		const response = await this._request<CoingeckoCoinListResponse | 404>(`/coins/list`, 'get')

		if (response === 404) {
			return []
		}

		return response
	}

	async coins(coinId: string): Promise<CoingeckoCoin | 404> {
		const response = await this._request<CoingeckoCoin | 404>(
			`/coins/:id?localization=false&tickers=false&market_data=false&community_data=true&developer_data=true&sparkline=false`,
			'get',
			{
				id: coinId,
			}
		)

		return response
	}

	async platforms(): Promise<CoingeckoBlockchainsListResponse> {
		const response = await this._request<CoingeckoBlockchainsListResponse | 404>(`/asset_platforms`, 'get')

		if (response === 404) {
			return []
		}

		return response
	}

	/**
	 * Récupère le top 250 des exchanges.
	 * Possible de récupérer plus en modifiant le paramètre page
	 * @param page Page à récupérer
	 */
	async exchangesList(page: number = 1): Promise<CoingeckoExchangeListResponse> {
		const response = await this._request<CoingeckoExchangeListResponse | 404>(
			`/exchanges?per_page=250?page=:page`,
			'get',
			{
				page: page.toString(10),
			}
		)

		if (response === 404) {
			return []
		}

		return response
	}

	async coinTickers(coinId: string, exchangeIds: string[], page = 1): Promise<CoingeckoCoinTickersListResponse> {
		const response = await this._request<any | 404>(
			`/coins/:id/tickers?exchange_ids=${exchangeIds.join(',')}&page=${page}`,
			'get',
			{
				id: coinId,
			}
		)

		if (response === 404) {
			return []
		}

		return response.tickers
	}

	async coinsMarketsStablecoins(currency: string): Promise<CoingeckoCoinMarketsResponse> {
		const response = await this._request<CoingeckoCoinMarketsResponse | 404>(
			`/coins/markets?vs_currency=:currency&category=:currency-stablecoin&order=market_cap_desc&per_page=250&page=1&sparkline=false`,
			'get',
			{
				currency: currency,
			}
		)
		if (response === 404) {
			return []
		}

		return response
	}

	async coinHistory(coinId: string, date: string): Promise<CoingeckoCoinHistory | null> {
		console.log(`Fetching history for ${coinId} on ${date}`)
		const response = await this._request<CoingeckoCoinHistory | 404>(
			`/coins/:id/history?date=:date&localization=false`,
			'get',
			{
				id: coinId,
				date: date,
			}
		)

		if (response === 404) {
			return null
		}

		return response
	}

	async _request<T>(
		url: string,
		method: 'get' | 'post',
		args?: { id?: string; date?: string; page?: string; currency?: string }
	): Promise<T | 404> {
		url = url.replace(':id', args?.id || '')
		url = url.replace(':date', args?.date || '')
		url = url.replace(':page', args?.page || '1')
		url = url.replace(/:currency/g, args?.currency || 'usd')

		let tries = 0

		while (tries < 5) {
			try {
				const response = await this.instance[method]<T>(url)
				// rate limit
				await new Promise((resolve) => setTimeout(resolve, (1000 * 60) / this.maxRequestsPerMinute))

				return response.data
			} catch (error: unknown) {
				tries++

				if (error instanceof AxiosError && error.message == 'Request failed with status code 429') {
					console.error(`Coingecko API rate limit exceeded, wait 90s`)
					await new Promise((resolve) => setTimeout(resolve, 1000 * 90))
				} else if (error instanceof AxiosError && error.message == 'Request failed with status code 404') {
					console.error(`Coingecko token deleted`)
					return 404
				} else {
					console.error(`Coingecko API returned status ${error}`)
					await new Promise((resolve) => setTimeout(resolve, 10_000))
				}
			}
		}

		throw new Error(`Coingecko API request failed after ${tries} tries`)
	}
}
