import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import {
	BlockchainDB,
	ExchangeDB,
	OfferWithLimitsDB,
	PortfolioCloudDB,
	TokenDB,
	UserDB
} from "@cryptobot/shared/src/prisma-types/db-api/DB.types";
import { UserToken } from "@cryptobot/shared/src/front-desktop/preload/UserToken.types";
import { ProcessStatus } from "@cryptobot/shared/src/front-desktop/preload/Process.types";
import {
	ExchangeLocalDB,
	PortfolioExchangesLocalDB,
	PortfolioLocalDB,
	PortfolioTokensLocalDB,
	PortfolioTokenTransactionsLocalDB,
	PortfolioWalletsLocalDB,
	PortfolioWithAllLocalDB,
	PortfolioWithStatsLocalDB,
	TokenApiLocalDB
} from "@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types";

// import { OfferPrisma } from 'db-api'
// import ipcRenderer = Electron.ipcRenderer;

// Custom APIs for renderer
const portfolioProcessApi = {
	updateTokens: async ({ portfolio }: { portfolio: PortfolioLocalDB }): Promise<void> => {
		await ipcRenderer.invoke('portfolio:updateTokens', { portfolio })
	},
	updateWallets: async ({
		portfolio,
		userToken,
	}: {
		portfolio: PortfolioLocalDB
		userToken: string
	}): Promise<void> => {
		await ipcRenderer.invoke('portfolio:updateWallets', { portfolio, userToken })
	},
	updateExchanges: async ({
		portfolio,
		userToken,
	}: {
		portfolio: PortfolioLocalDB
		userToken: string
	}): Promise<void> => {
		await ipcRenderer.invoke('portfolio:updateExchanges', { portfolio, userToken })
	},
	updateAll: async ({ portfolio, userToken }: { portfolio: PortfolioLocalDB; userToken: string }): Promise<void> => {
		await ipcRenderer.invoke('portfolio:updateAll', { portfolio, userToken })
	},
	updateAllPortfolios: async (): Promise<void> => {
		await ipcRenderer.invoke('portfolio:updateAllPortfolios')
	},
}

const localDbApi = {
	getLastMigration: async (): Promise<string> => {
		console.log('localDbApi.getLastMigration')
		return await ipcRenderer.invoke('localDbApi:getLastMigration')
	},
	getPortfolio: async ({ portfolioId }: { portfolioId: string }): Promise<PortfolioWithAllLocalDB> => {
		console.log('localDbApi.getPortfolio', portfolioId)
		return await ipcRenderer.invoke('localDbApi:getPortfolio', { portfolioId })
	},
	getPortfolios: async (): Promise<PortfolioWithStatsLocalDB[]> => {
		console.log('localDbApi.getPortfolios')
		return await ipcRenderer.invoke('localDbApi:getPortfolios')
	},
	getDbLocation: async (): Promise<string> => {
		console.log('localDbApi.getDbLocation')
		return await ipcRenderer.invoke('localDbApi:getDbLocation')
	},
	createPortfolio: async ({
		portfolioData,
		tokenTransactionsData,
		tokensData,
		walletsData,
		exchangesData,
	}: {
		portfolioData: PortfolioLocalDB
		tokenTransactionsData: PortfolioTokenTransactionsLocalDB[]
		tokensData: TokenDB[]
		walletsData: PortfolioWalletsLocalDB[]
		exchangesData: PortfolioExchangesLocalDB[]
	}): Promise<void> => {
		console.log(
			'localDbApi.createPortfolio',
			portfolioData,
			tokenTransactionsData.length,
			tokensData.length,
			walletsData.length,
			exchangesData.length
		)
		await ipcRenderer.invoke('localDbApi:createPortfolio', {
			portfolioData,
			tokenTransactionsData,
			tokensData,
			walletsData,
			exchangesData,
		})
	},
	getTokenApi: async ({ apiTokenId }: { apiTokenId: string }): Promise<TokenApiLocalDB> => {
		console.log('localDbApi.getTokenApi', apiTokenId)
		return await ipcRenderer.invoke('localDbApi:getTokenApi', { apiTokenId: apiTokenId })
	},
	getExchangeApi: async ({ exchangeId }: { exchangeId: string }): Promise<ExchangeLocalDB> => {
		console.log('localDbApi.getExchangeApi', exchangeId)
		return await ipcRenderer.invoke('localDbApi:getExchangeApi', { exchangeId: exchangeId })
	},
	createTokenApi: async ({
		apiToken,
		portfolioTokenId,
	}: {
		apiToken: TokenDB
		portfolioTokenId: string
	}): Promise<void> => {
		console.log('localDbApi.getTokenApi', apiToken.symbol)
		return await ipcRenderer.invoke('localDbApi:createTokenApi', { apiToken, portfolioTokenId })
	},
	editPortfolio: async ({
		portfolioData,
		tokenTransactionsData,
		portfolioTokensData,
		walletsData,
		exchangesData,
	}: {
		portfolioData: PortfolioLocalDB
		tokenTransactionsData: PortfolioTokenTransactionsLocalDB[]
		portfolioTokensData: PortfolioTokensLocalDB[]
		walletsData: PortfolioWalletsLocalDB[]
		exchangesData: PortfolioExchangesLocalDB[]
	}): Promise<void> => {
		console.log(
			'localDbApi.editPortfolio',
			portfolioData,
			tokenTransactionsData.length,
			portfolioTokensData.length,
			walletsData.length,
			exchangesData.length
		)
		await ipcRenderer.invoke('localDbApi:editPortfolio', {
			portfolioData,
			tokenTransactionsData,
			portfolioTokensData,
			walletsData,
			exchangesData,
		})
	},
	deletePortfolio: async ({ portfolioId }: { portfolioId: string }): Promise<void> => {
		console.log('localDbApi.deletePortfolio', portfolioId)
		await ipcRenderer.invoke('localDbApi:deletePortfolio', { portfolioId })
	},
}

const dbApi = {
	register: async ({ login, password }: { login: string; password: string }): Promise<UserDB> => {
		console.log('dbApi.register')
		return await ipcRenderer.invoke('dbApi:register', { login, password })
	},
	login: async ({
		login,
		password,
	}: {
		login: string
		password: string
	}): Promise<{ user: UserDB; token: UserToken }> => {
		console.log('dbApi.login', login)
		return await ipcRenderer.invoke('dbApi:login', { login, password })
	},
	me: async ({ token }: { token: string }): Promise<UserDB> => {
		console.log('dbApi.me')
		return await ipcRenderer.invoke('dbApi:me', { token })
	},
	getOffers: async ({ service }: { service: string }): Promise<OfferWithLimitsDB> => {
		console.log('dbApi.getOffers', service)
		return await ipcRenderer.invoke('dbApi:getOffers', { service })
	},
	getExchange: async ({ exchangeId }: { exchangeId: string }): Promise<ExchangeDB> => {
		console.log('dbApi.getExchange', exchangeId)
		return await ipcRenderer.invoke('dbApi:getExchange', { exchangeId })
	},
	getExchanges: async ({ service }: { service: string }): Promise<OfferWithLimitsDB> => {
		console.log('dbApi.getExchanges', service)
		return await ipcRenderer.invoke('dbApi:getExchanges', { service })
	},
	getToken: async ({ tokenId }: { tokenId: string }): Promise<TokenDB> => {
		console.log('dbApi.getToken tokenId', tokenId)
		return await ipcRenderer.invoke('dbApi:getToken', { tokenId })
	},
	getTokens: async ({ letter }: { letter: string }): Promise<TokenDB[]> => {
		console.log('dbApi.getTokens letter', letter)
		return await ipcRenderer.invoke('dbApi:getTokens', { letter })
	},
	getBlockchain: async ({ blockchainId }: { blockchainId: string }): Promise<BlockchainDB> => {
		console.log('dbApi.getBlockchain blockchainId', blockchainId)
		return await ipcRenderer.invoke('dbApi:getBlockchain', { blockchainId })
	},
	getMarketPrice: async ({
		coingeckoZerionId,
		currency,
		atDate,
	}: {
		coingeckoZerionId: string
		currency: string
		atDate: Date
	}): Promise<{ coingeckoId: string; price: number }> => {
		console.log('dbApi.getMarketPrice coingeckoId', coingeckoZerionId, 'currency', currency, 'atDate', atDate)
		return await ipcRenderer.invoke('dbApi:getMarketPrice', { coingeckoZerionId, currency, atDate })
	},
	getTokenBlockchains: async ({ tokenId }: { tokenId: string }): Promise<BlockchainDB[]> => {
		console.log('dbApi.getTokenBlockchains tokenId', tokenId)
		return await ipcRenderer.invoke('dbApi:getTokenBlockchains', { tokenId })
	},
	getTokenExchanges: async ({ tokenId }: { tokenId: string }): Promise<ExchangeDB[]> => {
		console.log('dbApi.getTokenExchanges tokenId', tokenId)
		return await ipcRenderer.invoke('dbApi:getTokenExchanges', { tokenId })
	},
	getCompatibleBlockchains: async ({ type }: { type: string }): Promise<BlockchainDB[]> => {
		console.log('dbApi.getCompatibleBlockchains type', type)
		return await ipcRenderer.invoke('dbApi:getCompatibleBlockchains', { type })
	},
	getPortfolios: async (): Promise<PortfolioCloudDB[]> => {
		console.log('dbApi.getPortfolios')
		return await ipcRenderer.invoke('dbApi:getPortfolios')
	},
	getPortfolio: async ({ portfolioId }: { portfolioId: string }): Promise<PortfolioCloudDB> => {
		console.log('dbApi.getPortfolio', portfolioId)
		return await ipcRenderer.invoke('dbApi:getPortfolio', { portfolioId })
	},
	createPortfolio: async ({ portfolio }: { portfolio: PortfolioCloudDB }): Promise<PortfolioCloudDB> => {
		console.log('dbApi.createPortfolio', portfolio)
		return await ipcRenderer.invoke('dbApi:createPortfolio', { portfolio })
	},
	ping: async (): Promise<boolean> => {
		// console.log('dbApi.ping')
		return await ipcRenderer.invoke('dbApi:ping')
	},
}

const systemApi = {
	getAppVersion: async (): Promise<string> => {
		console.log('system.getAppVersion')
		return await ipcRenderer.invoke('system:getAppVersion')
	},

	getIsDev: async (): Promise<boolean> => {
		console.log('system.getIsDev')
		return await ipcRenderer.invoke('system:getIsDev')
	},

	getProcessesStatus: async (): Promise<ProcessStatus> => {
		// console.log('system.getProcessesStatus')
		return await ipcRenderer.invoke('system:getProcessesStatus')
	},

	getProcessLogs: async ({ process }: { process: string }): Promise<string[]> => {
		console.log('system.getProcessLogs', process)
		return await ipcRenderer.invoke('system:getProcessLogs', { process })
	},
}

ipcRenderer.on('mainMsg:log:portfolio', (_event, log) => {
	// console.log('mainMsg:log:portfolio', log)
	window.postMessage({ type: 'mainMsg:log:portfolio', data: log }, '*')
})

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld('electron', electronAPI)
		contextBridge.exposeInMainWorld('portfolioProcessApi', portfolioProcessApi)
		contextBridge.exposeInMainWorld('systemApi', systemApi)
		contextBridge.exposeInMainWorld('dbApi', dbApi)
		contextBridge.exposeInMainWorld('localDbApi', localDbApi)
	} catch (error) {
		console.error(error)
	}
} else {
	// @ts-ignore (define in d.ts)
	window.electron = electronAPI
	// @ts-ignore (define in d.ts)
	window.portfolioProcessApi = portfolioApi
	// @ts-ignore (define in d.ts)
	window.systemApi = systemApi
	// @ts-ignore (define in d.ts)
	window.dbApi = dbApi
	// @ts-ignore (define in d.ts)
	window.localDbApi = localDbApi
	// @ts-ignore (define in d.ts)
	window.mainMsg = mainMsg
}
