import { ElectronAPI } from '@electron-toolkit/preload'
import { BlockchainDB, ExchangeDB, OfferWithLimitsDB, PortfolioDB, TokenDB, UserDB } from '@cryptobot/db-api'
import { ProcessStatus } from '../../main/process/process.types'
import { UserToken } from '@cryptobot/shared/src/front-desktop/preload/UserToken.types'
import {
	ExchangeLocalDB,
	PortfolioDataLocalDB,
	PortfolioExchangesLocalDB,
	PortfolioLocalDB,
	PortfolioTokensLocalDB,
	PortfolioTokenTransactionsLocalDB,
	PortfolioWalletsLocalDB,
	PortfolioWithAllLocalDB,
	PortfolioWithStatsLocalDB,
	TokenApiLocalDB,
} from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'

declare global {
	interface Window {
		electron: ElectronAPI
		mainMsg: {
			onLogMessage: (callback: (message: string) => void) => void
		}
		portfolioProcessApi: {
			updateTokens: ({ portfolio }: { portfolio: PortfolioLocalDB }) => Promise<void>
			updateWallets: ({
				portfolio,
				userToken: string,
			}: {
				portfolio: PortfolioLocalDB
				userToken: string
			}) => Promise<void>
			updateExchanges: ({
				portfolio,
				userToken: string,
			}: {
				portfolio: PortfolioLocalDB
				userToken: string
			}) => Promise<void>
			updateAll: ({
				portfolio,
				userToken: string,
			}: {
				portfolio: PortfolioLocalDB
				userToken: string
			}) => Promise<void>
			updateAllPortfolios: () => Promise<void>
		}
		dbApi: {
			register: ({ login, password }: { login: string; password: string }) => Promise<UserDB>
			login: ({
				login,
				password,
			}: {
				login: string
				password: string
			}) => Promise<{ user: UserDB; token: UserToken }>
			me: ({ token }: { token: string }) => Promise<UserDB>
			getOffers: ({ service }: { service: string }) => Promise<OfferWithLimitsDB[]>
			getExchanges: ({
				service,
				isDefi,
			}: {
				service: 'portfolio' | 'dca' | 'bots' | 'all'
				isDefi: 0 | 1
			}) => Promise<ExchangeDB[]>
			getExchange: ({ exchangeId }: { exchangeId: string }) => Promise<ExchangeDB>
			getBlockchain: ({ blockchainId }: { blockchainId: string }) => Promise<BlockchainDB>
			getToken: ({ tokenId }: { tokenId: string }) => Promise<TokenDB>
			getTokens: ({ letter }: { letter: string }) => Promise<TokenDB[]>
			getTokenBlockchains: ({ tokenId }: { tokenId: string }) => Promise<BlockchainDB[]>
			getCompatibleBlockchains: ({ type }: { type: string }) => Promise<BlockchainDB[]>
			getTokenExchanges: ({ tokenId }: { tokenId: string }) => Promise<ExchangeDB[]>
			getMarketPrice: ({
				coingeckoZerionId,
				currency,
				atDate,
			}: {
				coingeckoZerionId: string
				currency: string
				atDate: Date
			}) => Promise<{ coingeckoId: string; price: number }>
			getPortfolios: () => Promise<PortfolioDB[]>
			getPortfolio: ({ portfolioId }: { portfolioId: string }) => Promise<PortfolioDB>
			createPortfolio: ({ portfolio }: { portfolio: PortfolioDB }) => Promise<PortfolioDB>
			deletePortfolio: ({ portfolioId }: { portfolioId: string }) => Promise<void>
			ping: () => Promise<boolean>
		}
		/********* LOCAL DB API *********/
		localDbApi: {
			getLastMigration: () => Promise<string>
			getDbLocation: () => Promise<string>
			getPortfolios: () => Promise<PortfolioWithStatsLocalDB[]>
			getPortfolio: ({ portfolioId }: { portfolioId: string }) => Promise<PortfolioWithAllLocalDB>
			createPortfolio: ({
				portfolioData,
				tokenTransactionsData = [],
				tokensData = [],
				walletsData = [],
				exchangesData = [],
			}: {
				portfolioData: PortfolioDataLocalDB
				tokenTransactionsData: PortfolioTokenTransactionsLocalDB[]
				tokensData: PortfolioTokensLocalDB[]
				walletsData: PortfolioWalletsLocalDB[]
				exchangesData: PortfolioExchangesLocalDB[]
			}) => Promise<void>
			getTokenApi: ({ apiTokenId }: { apiTokenId: string }) => Promise<TokenApiLocalDB>
			getExchangeApi: ({ exchangeId }: { exchangeId: string }) => Promise<ExchangeLocalDB>
			createTokenApi: ({
				apiToken,
				portfolioTokenId,
			}: {
				apiToken: TokenDB
				portfolioTokenId: string
			}) => Promise<void>

			editPortfolio: ({
				portfolioData,
				tokenTransactionsData = [],
				portfolioTokensData = [],
				walletsData = [],
				exchangesData = [],
			}: {
				portfolioData: PortfolioLocalDB
				tokenTransactionsData: PortfolioTokenTransactionsLocalDB[]
				portfolioTokensData: PortfolioTokensLocalDB[]
				walletsData: PortfolioWalletsLocalDB[]
				exchangesData: PortfolioExchangesLocalDB[]
			}) => Promise<void>
			deletePortfolio: ({ portfolioId }: { portfolioId: string }) => Promise<void>
		}
		systemApi: {
			getAppVersion: () => Promise<string>
			getIsDev: () => Promise<boolean>
			getProcessesStatus: () => Promise<ProcessStatus>
			getProcessLogs: ({ process }: { process: string }) => Promise<string[]>
		}
	}
}
