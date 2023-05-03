import { config } from "dotenv-mono";
import axios, { AxiosInstance } from "axios";
import {
	EVMBalance,
	EVMInternalTransaction,
	EVMInternalTransactionResponse,
	EVMNormalTransaction,
	EVMNormalTransactionResponse
} from "./EVMBlockchain.types";

config()

export class EVMBlockchain {
	protected api_url: string
	protected api_key: string
	protected instance: AxiosInstance
	protected maxRequestsPerMinute = 290 // 5 requests per second in free version

	constructor(api_url: string, api_key: string) {
		this.api_url = api_url
		this.api_key = api_key

		this.instance = axios.create({
			baseURL: this.api_url,
			headers: {
				"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
			}
		})
	}

	async getNativeTokenBalance(address: string): Promise<EVMBalance> {
		const result = await this._request<EVMBalance>(
			'?module=account&action=balance&address=:address&tag=latest',
			'get',
			{ address }
		)
		return result
	}

	async getNormalTransactions(address: string, startBlock = 0): Promise<EVMNormalTransaction[]> {
		const result = await this._request<EVMNormalTransactionResponse>(
			'?module=account&action=txlist&address=:address&startblock=:startBlock&endblock=99999999&page=1&offset=10000&sort=asc',
			'get',
			{ address, startBlock }
		)
		return result.result
	}

	async getInternalTransactions(address: string, startBlock = 0): Promise<EVMInternalTransaction[]> {
		const result = await this._request<EVMInternalTransactionResponse>(
			'?module=account&action=txlistinternal&address=:address&startblock=:startBlock&endblock=99999999&page=1&offset=10000&sort=asc',
			'get',
			{ address, startBlock }
		)
		return result.result
	}

	async getERC20Transactions(address: string, startBlock = 0): Promise<EVMInternalTransaction[]> {
		const result = await this._request<EVMInternalTransactionResponse>(
			'?module=account&action=tokentx&address=:address&startblock=:startBlock&endblock=99999999&page=1&offset=10000&sort=asc',
			'get',
			{ address, startBlock }
		)
		return result.result
	}

	async _request<T>(
		url: string,
		method: 'get' | 'post',
		args?: { address?: string; startBlock?: number }
	): Promise<T> {
		url = url.replace(':address', args?.address || '')
		url = url.replace(':startBlock', args?.startBlock?.toString() || '')
		url += `&apikey=${this.api_key}`

		console.log(`EVM API request: ${this.api_url}${url}`)

		let tries = 0

		while (tries < 5) {
			try {
				const response = await this.instance[method]<T>(url)
				console.log(response)
				if (response.status !== 200) {
					await new Promise((resolve) => setTimeout(resolve, 1000 * 2))
					continue
				}
				// rate limit
				await new Promise((resolve) => setTimeout(resolve, (1000 * 60) / this.maxRequestsPerMinute))

				return response.data
			} catch (error: unknown) {
				tries++

				// @ts-ignore
				console.error(`EVM scan (${this.api_url}) returned status ${error}`)
				await new Promise((resolve) => setTimeout(resolve, 10_000))

			}
		}

		throw new Error(`EVM Blockchains (${this.api_url}) API request failed after ${tries} tries`)
	}
}
