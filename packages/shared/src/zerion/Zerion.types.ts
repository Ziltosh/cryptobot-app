export type ZerionFilterTransactionTypes = ('trade' | 'receive' | 'send' | 'deposit' | 'withdraw' | 'mint' | 'burn')[]

export interface ZerionWalletPortfolioResponse {
	links: LinksWalletPortfolio
	data: DataWalletPortfolio
}

export interface ZerionWalletTransactionsResponse {
	links: LinksWalletTransactions
	data: ZerionTransaction[]
}

export type ZerionChainsResponse = {
	links: {
		self: string
	}
	data: ZerionBlockchain[]
}

export type ZerionBlockchain = {
	type: string
	id: string
	attributes: {
		external_id: string
		name: string
		icon: {
			url: string
		}
		explorer: {
			name: string
			token_url_format: string
			tx_url_format: string
			home_url: string
		}
		rpc: {
			public_servers_url: Array<string>
		}
		flags: {
			supports_trading: boolean
			supports_sending: boolean
			supports_bridge: boolean
		}
	}
	relationships: {
		native_fungible: {
			links: {
				related: string
			}
			data: {
				type: string
				id: string
			}
		}
		wrapped_native_fungible: {
			links: {
				related: string
			}
			data: {
				type: string
				id: string
			}
		}
	}
	links: {
		self: string
	}
}

export type ZerionFungiblesResponse = {
	links: {
		self: string
		next: string
	}
	data: Array<ZerionFungible>
}

export interface ZerionFungible {
	type: string
	id: string
	attributes: {
		name: string
		symbol: string
		description?: string
		icon?: {
			url: string
		}
		flags: {
			verified: boolean
		}
		external_links?: Array<{
			type: string
			name: string
			url: string
		}>
		implementations: Array<{
			chain_id: string
			address: string
			decimals: number
		}>
		market_data?: {
			total_supply?: number
			circulating_supply?: number
			market_cap: any
			fully_diluted_valuation: any
			price: any
			changes: {
				percent_1d: any
				percent_30d: any
				percent_90d: any
				percent_365d: any
			}
		}
	}
	relationships?: {
		chart_day: {
			links: {
				related: string
			}
			data: {
				type: string
				id: string
			}
		}
		chart_hour: {
			links: {
				related: string
			}
			data: {
				type: string
				id: string
			}
		}
		chart_max: {
			links: {
				related: string
			}
			data: {
				type: string
				id: string
			}
		}
		chart_month: {
			links: {
				related: string
			}
			data: {
				type: string
				id: string
			}
		}
		chart_week: {
			links: {
				related: string
			}
			data: {
				type: string
				id: string
			}
		}
		chart_year: {
			links: {
				related: string
			}
			data: {
				type: string
				id: string
			}
		}
	}
	links: {
		self: string
	}
}

export interface ZerionFungibleInfo {
	name: string
	symbol: string
	icon: Icon
	flags: Flags
	implementations: Implementation[]
}

export type ZerionChartResponse = {
	links: {
		self: string
	}
	data: {
		type: string
		id: string
		attributes: {
			begin_at: string
			end_at: string
			stats: {
				first: number
				min: number
				avg: number
				max: number
				last: number
			}
			points: Array<Array<number>>
		}
	}
}

export interface ZerionTransaction {
	type: string
	id: string
	attributes: AttributesWalletTransactions
	relationships: Relationships
}

export interface ZerionFee {
	fungible_info: ZerionFungibleInfo
	quantity: Quantity
	price?: number
	value?: number
}

export interface ZerionTransfer {
	fungible_info?: ZerionFungibleInfo
	direction: string
	quantity: Quantity
	value?: number
	price?: number
	sender: string
	recipient: string
	nft_info?: NftInfo
}

//-----------------//

// portfolio
interface LinksWalletPortfolio {
	self: string
}

interface DataWalletPortfolio {
	type: string
	id: string
	attributes: Attributes
}

interface Attributes {
	positions_distribution_by_type: PositionsDistributionByType
	positions_distribution_by_chain: PositionsDistributionByChain
	total: Total
	changes: Changes
}

interface PositionsDistributionByType {
	wallet: number
	deposited: number
	borrowed: number
	locked: number
	staked: number
}

interface PositionsDistributionByChain {
	arbitrum: number
	aurora: number
	avalanche: number
	'binance-smart-chain': number
	ethereum: number
	fantom: number
	loopring: number
	optimism: number
	polygon: number
	solana: number
	xdai: number
}

interface Total {
	positions: number
}

interface Changes {
	absolute_1d: number
	percent_1d: number
}

// transactions
interface LinksWalletTransactions {
	self: string
	next: string
}

interface AttributesWalletTransactions {
	operation_type: string
	hash: string
	mined_at_block: number
	mined_at: string
	sent_from: string
	sent_to: string
	status: string
	nonce: number
	fee: ZerionFee
	transfers: ZerionTransfer[]
	approvals: any[]
}

interface Icon {
	url: string
}

interface Flags {
	verified: boolean
}

interface Implementation {
	chain_id: string
	address: string
	decimals: number
}

interface Quantity {
	int: string
	decimals: number
	float: number
	numeric: string
}

interface NftInfo {
	contract_address: string
	token_id: string
	name: string
	interface: string
	content: Content
}

interface Content {
	preview: Preview
	detail: Detail
}

interface Preview {
	url: string
	content_type: any
}

interface Detail {
	url: string
	content_type: any
}

interface Relationships {
	chain: Chain
}

interface Chain {
	links: LinksChain
	data: DataChain
}

interface LinksChain {
	related: string
}

interface DataChain {
	type: string
	id: string
}
