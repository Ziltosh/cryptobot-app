import { checkMigration } from '../prisma/prismaHelpers'
import path from 'node:path'
import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell } from 'electron'
import process from 'process'

export function createMainWindow(): BrowserWindow {
	// process.env.DATABASE_URL = `file:${dbUserPath}`
	checkMigration().then(null)

	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1300,
		height: 960,
		minWidth: 1100,
		minHeight: 700,
		show: false,
		autoHideMenuBar: true,
		...(process.platform === 'linux'
			? {
					icon: path.join(__dirname, '../../assets/icon.png'),
			  }
			: {}),
		webPreferences: {
			preload: path.join(__dirname, '../preload/index.js'),
			//sandbox: false,
			nodeIntegrationInWorker: true,
		},
	})

	mainWindow.on('ready-to-show', () => {
		if (is.dev) mainWindow.showInactive()
		else mainWindow.show()
	})

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url).then(null)
		return { action: 'deny' }
	})

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']).then(null)

		// @ts-ignore define somewhere
		mainWindow.openDevTools()
	} else {
		mainWindow.loadFile(path.join(__dirname, '../renderer/index.html')).then(null)
	}

	return mainWindow
}

export function createDebugWindow(): BrowserWindow {
	const debugWindow = new BrowserWindow({
		width: 800,
		height: 1000,
		minWidth: 800,
		minHeight: 600,
		autoHideMenuBar: true,
		x: 0,
		y: 0,
		webPreferences: {
			preload: path.join(__dirname, '../preload/index.js'),
			nodeIntegrationInWorker: true,
		},
	})

	debugWindow.on('ready-to-show', () => {
		if (is.dev) debugWindow.showInactive()
		else debugWindow.show()
	})

	debugWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url).then(null)
		return { action: 'deny' }
	})

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		debugWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/index_debug.html').then(null)
		// console.log('ELECTRON_RENDERER_URL', process.env['ELECTRON_RENDERER_URL'])

		// @ts-ignore define somewhere
		// debugWindow.openDevTools()
	}

	return debugWindow
}

// export function createWorkersWindow(): BrowserWindow {}
