import { PortfolioProcess } from '../../process/PortfolioProcess'
import { PortfolioLocalDB } from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'

export const portfolioApiUpdateTokens = async (
	portfolioProcess: PortfolioProcess,
	portfolio: PortfolioLocalDB
): Promise<void> => {
	// local
	console.log('portfolioApiUpdateTokens', portfolio)
	await portfolioProcess.actionUpdateTokens([{ ...portfolio }])
}

export const portfolioApiUpdateWallets = async (
	portfolioProcess: PortfolioProcess,
	portfolio: PortfolioLocalDB,
	userToken: string
): Promise<void> => {
	// local
	console.log('portfolioApiUpdateWallets', portfolio)
	await portfolioProcess.actionUpdateWallets([{ ...portfolio }], userToken)
}

export const portfolioApiUpdateExchanges = async (
	portfolioProcess: PortfolioProcess,
	portfolio: PortfolioLocalDB,
	userToken: string
): Promise<void> => {
	// local
	console.log('portfolioApiUpdateExchanges', portfolio)
	await portfolioProcess.actionUpdateExchanges([{ ...portfolio }], userToken)
}

export const portfolioApiUpdateAll = async (
	portfolioProcess: PortfolioProcess,
	portfolio: PortfolioLocalDB,
	userToken: string
): Promise<void> => {
	// local
	console.log('portfolioApiUpdateAll', portfolio)
	await portfolioProcess.actionUpdateAll([{ ...portfolio }], userToken)
}

export const portfolioApiUpdateAllPortfolios = async (portfolioProcess: PortfolioProcess): Promise<void> => {
	// local
	await portfolioProcess.actionUpdateAllPortfolios()
}
