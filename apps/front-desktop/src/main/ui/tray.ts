import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron'
import appIcon from '../../../public/assets/icon.png'
import { createMainWindow } from './window'

export function addTray(mainWindow: BrowserWindow): void {
	const tray = new Tray(nativeImage.createFromPath(appIcon))
	tray.setToolTip('CryptoBot')
	// tray.on('click', () => {
	// 	if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
	// 	else mainWindow.show()
	// })

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Show App',
			click: (): void => {
				if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
				else mainWindow.show()
			},
		},
		{
			label: 'Quit',
			click: (): void => {
				app.quit()
			},
		},
	])

	tray.setContextMenu(contextMenu)
}
