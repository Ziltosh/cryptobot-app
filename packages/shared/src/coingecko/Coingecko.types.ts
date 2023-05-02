export type CoingeckoPingResponse = {
	gecko_says: string
}

export type CoingeckoCoinListResponse = CoinGeckoCoinMinimal[]

export type CoingeckoExchangeListResponse = CoinGeckoExchange[]

export type CoingeckoCoinTickersListResponse = CoinGeckoCoinTicker[]
export type CoingeckoCoinTickersResponse = {
	name: string
	tickers: CoingeckoCoinTickersListResponse
}

export type CoingeckoBlockchainsListResponse = CoinGeckoBlockchain[]

export interface CoinGeckoExchange {
	id: string
	name: string
	year_established?: number
	country?: string
	description?: string
	url: string
	image: string
	has_trading_incentive?: boolean
	trust_score?: number
	trust_score_rank?: number
	trade_volume_24h_btc?: number
	trade_volume_24h_btc_normalized?: number
}

export interface CoingeckoCoin extends CoinGeckoCoinMinimal {
	asset_platform_id?: any
	detail_platforms?: any
	block_time_in_minutes?: number
	hashing_algorithm?: string
	categories?: string[]
	public_notice?: any
	additional_notices?: any[]
	description?: Description
	links?: Links
	image?: Image
	country_origin?: string
	genesis_date?: string
	sentiment_votes_up_percentage?: number
	sentiment_votes_down_percentage?: number
	market_cap_rank?: number
	coingecko_rank?: number
	coingecko_score?: number
	developer_score?: number
	community_score?: number
	liquidity_score?: number
	public_interest_score?: number
	community_data?: CommunityData
	developer_data?: DeveloperData
	public_interest_stats?: PublicInterestStats
	status_updates?: any[]
	last_updated?: string
}

type CoinGeckoCoinMinimal = {
	id?: string
	symbol?: string
	name?: string
	platforms?: Platforms
}

export interface CoinGeckoCoinTicker {
	base: string
	target: string
	market: Market
	last: number
	volume: number
	converted_last: ConvertedLast
	converted_volume: ConvertedVolume
	trust_score: string
	bid_ask_spread_percentage: number
	timestamp: string
	last_traded_at: string
	last_fetch_at: string
	is_anomaly: boolean
	is_stale: boolean
	trade_url: string
	token_info_url: any
	coin_id: string
	target_coin_id?: string
}

export interface CoinGeckoBlockchain {
	id: string
	chain_identifier?: number
	name: string
	shortname: string
}

export interface CoingeckoCoinHistory {
	id: string
	symbol: string
	name: string
	image: Image
	market_data: MarketData
	community_data: CommunityData
	developer_data: DeveloperData
	public_interest_stats: PublicInterestStats
}

export type CoingeckoCoinMarketsResponse = CoinGeckoCoinMarket[]

export interface MarketData {
	current_price: CurrentPrice
	market_cap: MarketCap
	total_volume: TotalVolume
}

interface Platforms {
	ethereum?: string
	'polygon-pos'?: string
	energi?: string
	'harmony-shard-0'?: string
	avalanche?: string
	fantom?: string
	aurora?: string
	'binance-smart-chain'?: string
	xdai?: string
	smartbch?: string
	'near-protocol'?: string
	solana?: string
	'arbitrum-one'?: string
	bitgert?: string
	tron?: string
	cardano?: string
	'optimistic-ethereum'?: string
	sora?: string
	'huobi-token'?: string
	kardiachain?: string
	polkadot?: string
	karura?: string
	moonbeam?: string
	chiliz?: string
	boba?: string
	komodo?: string
	Bitcichain?: string
	'metis-andromeda'?: string
	elrond?: string
	ardor?: string
	qtum?: string
	stellar?: string
	cronos?: string
	osmosis?: string
	syscoin?: string
	'klay-token'?: string
	algorand?: string
	moonriver?: string
	celo?: string
	eos?: string
	astar?: string
	kusama?: string
	secret?: string
	terra?: string
	aptos?: string
	telos?: string
	acala?: string
	evmos?: string
	stacks?: string
	waves?: string
	cosmos?: string
	'okex-chain'?: string
	'proof-of-memes'?: string
	velas?: string
	oasis?: string
	ronin?: string
	ethereumpow?: string
	icon?: string
	fuse?: string
	nem?: string
	binancecoin?: string
	elastos?: string
	'milkomeda-cardano'?: string
	theta?: string
	meter?: string
	iotex?: string
	'hedera-hashgraph'?: string
	'xdc-network'?: string
	zilliqa?: string
	xrp?: string
	'arbitrum-nova'?: string
	nuls?: string
	rootstock?: string
	'mixin-network'?: string
	songbird?: string
	canto?: string
	'fusion-network'?: string
	hydra?: string
	neo?: string
	'kucoin-community-chain'?: string
	dogechain?: string
	tezos?: string
	kava?: string
	'step-network'?: string
	'defi-kingdoms-blockchain'?: string
	'bitkub-chain'?: string
	'ethereum-classic'?: string
	vechain?: string
	'bitcoin-cash'?: string
	everscale?: string
	exosama?: string
	gochain?: string
	findora?: string
	godwoken?: string
	'coinex-smart-chain'?: string
	tomochain?: string
	conflux?: string
	stratis?: string
	cube?: string
	bittorrent?: string
	'shiden network'?: string
	tombchain?: string
	'sx-network'?: string
	'metaverse-etp'?: string
	ontology?: string
	'enq-enecuum'?: string
	omni?: string
	thundercore?: string
	bitshares?: string
	'flare-network'?: string
	factom?: string
	wanchain?: string
	'hoo-smart-chain'?: string
	'function-x'?: string
	onus?: string
	skale?: string
	ShibChain?: string
	'wemix-network'?: string
	oasys?: string
	thorchain?: string
	'celer-network'?: string
	vite?: string
	yocoin?: string
	'super-zero'?: string
}

interface Description {
	en: string
}

interface Links {
	homepage: string[]
	blockchain_site: string[]
	official_forum_url: string[]
	chat_url: string[]
	announcement_url: string[]
	twitter_screen_name: string
	facebook_username: string
	bitcointalk_thread_identifier: any
	telegram_channel_identifier: string
	subreddit_url: string
	repos_url: ReposUrl
}

interface ReposUrl {
	github: string[]
	bitbucket: any[]
}

interface Image {
	thumb: string
	small: string
	large: string
}

interface CommunityData {
	facebook_likes: any
	twitter_followers: number
	reddit_average_posts_48h: number
	reddit_average_comments_48h: number
	reddit_subscribers: number
	reddit_accounts_active_48h: number
	telegram_channel_user_count: any
}

interface DeveloperData {
	forks: number
	stars: number
	subscribers: number
	total_issues: number
	closed_issues: number
	pull_requests_merged: number
	pull_request_contributors: number
	code_additions_deletions_4_weeks: CodeAdditionsDeletions4Weeks
	commit_count_4_weeks: number
	last_4_weeks_commit_activity_series: number[]
}

interface CodeAdditionsDeletions4Weeks {
	additions: number
	deletions: number
}

interface PublicInterestStats {
	alexa_rank: number
	bing_matches: any
}

interface Market {
	name: string
	identifier: string
	has_trading_incentive: boolean
}

interface ConvertedLast {
	btc: number
	eth: number
	usd: number
}

interface ConvertedVolume {
	btc: number
	eth: number
	usd: number
}

export interface CurrentPrice {
	aed: number
	ars: number
	aud: number
	bch: number
	bdt: number
	bhd: number
	bmd: number
	bnb: number
	brl: number
	btc: number
	cad: number
	chf: number
	clp: number
	cny: number
	czk: number
	dkk: number
	dot: number
	eos: number
	eth: number
	eur: number
	gbp: number
	hkd: number
	huf: number
	idr: number
	ils: number
	inr: number
	jpy: number
	krw: number
	kwd: number
	lkr: number
	ltc: number
	mmk: number
	mxn: number
	myr: number
	ngn: number
	nok: number
	nzd: number
	php: number
	pkr: number
	pln: number
	rub: number
	sar: number
	sek: number
	sgd: number
	thb: number
	try: number
	twd: number
	uah: number
	usd: number
	vef: number
	vnd: number
	xag: number
	xau: number
	xdr: number
	xlm: number
	xrp: number
	yfi: number
	zar: number
	bits: number
	link: number
	sats: number
}

export interface MarketCap {
	aed: number
	ars: number
	aud: number
	bch: number
	bdt: number
	bhd: number
	bmd: number
	bnb: number
	brl: number
	btc: number
	cad: number
	chf: number
	clp: number
	cny: number
	czk: number
	dkk: number
	dot: number
	eos: number
	eth: number
	eur: number
	gbp: number
	hkd: number
	huf: number
	idr: number
	ils: number
	inr: number
	jpy: number
	krw: number
	kwd: number
	lkr: number
	ltc: number
	mmk: number
	mxn: number
	myr: number
	ngn: number
	nok: number
	nzd: number
	php: number
	pkr: number
	pln: number
	rub: number
	sar: number
	sek: number
	sgd: number
	thb: number
	try: number
	twd: number
	uah: number
	usd: number
	vef: number
	vnd: number
	xag: number
	xau: number
	xdr: number
	xlm: number
	xrp: number
	yfi: number
	zar: number
	bits: number
	link: number
	sats: number
}

export interface TotalVolume {
	aed: number
	ars: number
	aud: number
	bch: number
	bdt: number
	bhd: number
	bmd: number
	bnb: number
	brl: number
	btc: number
	cad: number
	chf: number
	clp: number
	cny: number
	czk: number
	dkk: number
	dot: number
	eos: number
	eth: number
	eur: number
	gbp: number
	hkd: number
	huf: number
	idr: number
	ils: number
	inr: number
	jpy: number
	krw: number
	kwd: number
	lkr: number
	ltc: number
	mmk: number
	mxn: number
	myr: number
	ngn: number
	nok: number
	nzd: number
	php: number
	pkr: number
	pln: number
	rub: number
	sar: number
	sek: number
	sgd: number
	thb: number
	try: number
	twd: number
	uah: number
	usd: number
	vef: number
	vnd: number
	xag: number
	xau: number
	xdr: number
	xlm: number
	xrp: number
	yfi: number
	zar: number
	bits: number
	link: number
	sats: number
}

interface CoinGeckoCoinMarket {
	id: string
	symbol: string
	name: string
	image: string
	current_price: number
	market_cap: number
	market_cap_rank?: number
	fully_diluted_valuation?: number
	total_volume: number
	high_24h?: number
	low_24h?: number
	price_change_24h?: number
	price_change_percentage_24h?: number
	market_cap_change_24h?: number
	market_cap_change_percentage_24h?: number
	circulating_supply: number
	total_supply?: number
	max_supply?: number
	ath: number
	ath_change_percentage: number
	ath_date: string
	atl: number
	atl_change_percentage: number
	atl_date: string
	roi?: Roi
	last_updated: string
}

export interface Roi {
	times: number
	currency: string
	percentage: number
}
