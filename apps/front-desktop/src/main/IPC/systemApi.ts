import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import { PortfolioProcess } from '../process/PortfolioProcess'
import { DcaProcess } from '../process/DCAProcess'
import fs from 'fs'
import path from 'path'
import { ProcessStatus } from '@cryptobot/shared/src/front-desktop/preload/Process.types'

export const systemGetAppVersion = (): string => {
	console.log('main: systemGetVersion ')
	return app.getVersion()
}

export const systemGetIsDev = (): boolean => {
	console.log('main: systemGetIsDev ')
	return is.dev
}

export const systemGetProcessesStatus = (portfolio?: PortfolioProcess, dca?: DcaProcess): ProcessStatus => {
	return {
		portfolio: !!portfolio?.ping(),
		dca: !!dca?.ping(),
		bots: false,
	}
}

export const systemGetProcessLogs = (process: string): string[] => {
	return fs.readFileSync(path.join(__dirname, `../../logs/${process}.log`), 'utf8').split('\n')
}
