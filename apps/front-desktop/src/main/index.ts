import { app, BrowserWindow, ipcMain } from "electron";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import "reflect-metadata";
import { systemGetAppVersion, systemGetIsDev, systemGetProcessesStatus, systemGetProcessLogs } from "./IPC/systemApi";
import { createMainWindow } from "./ui/window";
import { addTray } from "./ui/tray";
import { PortfolioProcess } from "./process/PortfolioProcess";
import {
	localApiCreatePortfolio,
	localApiCreateTokenApi,
	localApiDeletePortfolio,
	localApiEditPortfolio,
	localApiGetDbLocation,
	localApiGetExchangeApi,
	localApiGetLastMigration,
	localApiGetPortfolio,
	localApiGetPortfolios,
	localApiGetTokenApi
} from "./IPC/portfolio/portfolioLocalApi";
import { initPrismaClient } from "./prisma/initPrismaClient";
import {
	portfolioApiUpdateAll,
	portfolioApiUpdateAllPortfolios,
	portfolioApiUpdateExchanges,
	portfolioApiUpdateTokens,
	portfolioApiUpdateWallets
} from "./IPC/portfolio/portfolioProcessApi";
import {
	dbApiCreatePortfolio,
	dbApiDeletePortfolio,
	dbApiGetBlockchain,
	dbApiGetCompatibleBlockchains,
	dbApiGetExchange,
	dbApiGetExchanges,
	dbApiGetMarketPrice,
	dbApiGetOffers,
	dbApiGetPortfolio,
	dbApiGetPortfolios,
	dbApiGetToken,
	dbApiGetTokenBlockchains,
	dbApiGetTokenExchanges,
	dbApiGetTokens,
	dbApiLogin,
	dbApiMe,
	dbApiPing,
	dbApiRegister
} from "@cryptobot/shared/src/front-desktop/main/process/dbApi.fn";

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
void app.whenReady().then(() => {
	// Set app user model id for windows
	electronApp.setAppUserModelId('fr.crypto-bot')

	const localPrisma = initPrismaClient()

	// portfolioProcess.on('message', (message) => {
	// 	switch (message.type) {
	// 		case 'action.progress':
	// 			mainWindow.setProgressBar(message.data)
	// 			break
	// 		case 'action:finish':
	// 			console.log(`[PORTFOLIO] finish: ${message.data}`)
	// 			mainWindow.setProgressBar(-1)
	// 			break
	// 		default:
	// 	}
	// })

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	const mainWindow = createMainWindow()
	addTray(mainWindow)

	const portfolioProcess = new PortfolioProcess(
		localPrisma,
		app.isPackaged ? app.getPath('userData') : '../../',
		mainWindow
	)

	// if (!app.isPackaged) createDebugWindow()

	// IPC PORTFOLIO
	ipcMain.handle('portfolio:updateTokens', async (_event, { portfolio }) =>
		portfolioApiUpdateTokens(portfolioProcess, portfolio)
	)
	ipcMain.handle('portfolio:updateWallets', async (_event, { portfolio, userToken }) =>
		portfolioApiUpdateWallets(portfolioProcess, portfolio, userToken)
	)
	ipcMain.handle('portfolio:updateExchanges', async (_event, { portfolio, userToken }) =>
		portfolioApiUpdateExchanges(portfolioProcess, portfolio, userToken)
	)
	ipcMain.handle('portfolio:updateAll', async (_event, { portfolio, userToken }) =>
		portfolioApiUpdateAll(portfolioProcess, portfolio, userToken)
	)
	ipcMain.handle('portfolio:updateAllPortfolios', async () => portfolioApiUpdateAllPortfolios(portfolioProcess))

	// IPC SYSTEM
	ipcMain.handle('system:getAppVersion', async () => systemGetAppVersion())
	ipcMain.handle('system:getIsDev', async () => systemGetIsDev())
	ipcMain.handle('system:getProcessesStatus', async () => systemGetProcessesStatus(portfolioProcess))
	ipcMain.handle('system:getProcessLogs', async (_event, { process }) => systemGetProcessLogs(process))

	// IPC DB API
	ipcMain.handle('dbApi:register', async (_event, { login, password }) => dbApiRegister({ login, password }))
	ipcMain.handle('dbApi:login', async (_event, { login, password }) => dbApiLogin({ login, password }))
	ipcMain.handle('dbApi:me', async (_event, { token }) => dbApiMe({ token }))
	ipcMain.handle('dbApi:getOffers', async (_event, { service }) => dbApiGetOffers({ service }))
	ipcMain.handle('dbApi:getExchange', async (_event, { exchangeId }) => dbApiGetExchange({ exchangeId }))
	ipcMain.handle('dbApi:getExchanges', async (_event, { service, isDefi }) => dbApiGetExchanges({ service, isDefi }))
	ipcMain.handle('dbApi:getBlockchain', async (_event, { blockchainId }) => dbApiGetBlockchain({ blockchainId }))
	ipcMain.handle('dbApi:getToken', async (_event, { tokenId }) => dbApiGetToken({ tokenId }))
	ipcMain.handle('dbApi:getTokens', async (_event, { letter }) => dbApiGetTokens({ letter }))
	ipcMain.handle('dbApi:getTokenBlockchains', async (_event, { tokenId }) => dbApiGetTokenBlockchains({ tokenId }))
	ipcMain.handle('dbApi:getCompatibleBlockchains', async (_event, { type }) =>
		dbApiGetCompatibleBlockchains({ type })
	)
	ipcMain.handle('dbApi:getTokenExchanges', async (_event, { tokenId }) => dbApiGetTokenExchanges({ tokenId }))
	ipcMain.handle('dbApi:getMarketPrice', async (_event, { coingeckoZerionId, currency, atDate }) =>
		dbApiGetMarketPrice({ coingeckoOrZerionId: coingeckoZerionId, currency, atDate })
	)
	ipcMain.handle('dbApi:createPortfolio', async (_event, { portfolio }) => dbApiCreatePortfolio({ portfolio }))
	ipcMain.handle('dbApi:getPortfolios', async () => dbApiGetPortfolios())
	ipcMain.handle('dbApi:getPortfolio', async (_event, { portfolioId }) => dbApiGetPortfolio({ portfolioId }))
	ipcMain.handle('dbApi:deletePortfolio', async (_event, { portfolioId }) => dbApiDeletePortfolio({ portfolioId }))
	ipcMain.handle('dbApi:ping', async () => dbApiPing())

	// IPC LOCAL DB API
	ipcMain.handle('localDbApi:getLastMigration', async () => localApiGetLastMigration(localPrisma))
	ipcMain.handle('localDbApi:getDbLocation', async () => localApiGetDbLocation())
	ipcMain.handle(
		'localDbApi:createPortfolio',
		async (_event, { portfolioData, tokenTransactionsData, tokensData, walletsData, exchangesData }) =>
			localApiCreatePortfolio({
				localPrisma,
				portfolioData,
				tokenTransactionsData,
				tokensData,
				walletsData,
				exchangesData,
			})
	)
	ipcMain.handle(
		'localDbApi:editPortfolio',
		async (
			_event,
			{
				portfolioData,
				tokenTransactionsData,
				portfolioTokensData: portfolioTokensData,
				walletsData,
				exchangesData,
			}
		) =>
			localApiEditPortfolio({
				localPrisma,
				portfolioData,
				tokenTransactionsData,
				portfolioTokensData,
				walletsData,
				exchangesData,
			})
	)
	ipcMain.handle('localDbApi:getTokenApi', async (_event, { apiTokenId: apiTokenId }) =>
		localApiGetTokenApi({ localPrisma, apiTokenId: apiTokenId })
	)
	ipcMain.handle('localDbApi:getExchangeApi', async (_event, { exchangeId }) =>
		localApiGetExchangeApi({ localPrisma, exchangeId })
	)
	ipcMain.handle('localDbApi:createTokenApi', async (_event, { apiToken, portfolioTokenId }) =>
		localApiCreateTokenApi({ localPrisma, apiToken, portfolioTokenId })
	)
	ipcMain.handle('localDbApi:getPortfolio', async (_event, { portfolioId }) =>
		localApiGetPortfolio({ localPrisma, portfolioId })
	)
	ipcMain.handle('localDbApi:getPortfolios', async () => localApiGetPortfolios({ localPrisma }))
	ipcMain.handle('localDbApi:deletePortfolio', async (_event, { portfolioId }) =>
		localApiDeletePortfolio({ localPrisma, portfolioId })
	)

	//
	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
	})
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	// if (process.platform !== 'darwin') {
	// app.quit()
	// }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
