import path from 'path'
import { app } from 'electron'

export const dbUserPath = path.join(app.getPath('userData'), 'user.sqlite')

export const platformToExecutables = {
	win32: {
		migrationEngine: `${
			app.isPackaged ? 'app.asar.unpacked/' : ''
		}node_modules/@prisma/engines/migration-engine-windows.exe`,
		queryEngine: `${
			app.isPackaged ? 'app.asar.unpacked/' : ''
		}node_modules/@prisma/engines/query_engine-windows.dll.node`,
	},
	linux: {
		migrationEngine: `${
			app.isPackaged ? 'app.asar.unpacked/' : ''
		}node_modules/@prisma/engines/migration-engine-debian-openssl-1.1.x`,
		queryEngine: `${
			app.isPackaged ? 'app.asar.unpacked/' : ''
		}node_modules/@prisma/engines/libquery_engine-debian-openssl-1.1.x.so.node`,
	},
	darwin: {
		migrationEngine: `${
			app.isPackaged ? 'app.asar.unpacked/' : ''
		}node_modules/@prisma/engines/migration-engine-darwin`,
		queryEngine: `${
			app.isPackaged ? 'app.asar.unpacked/' : ''
		}node_modules/@prisma/engines/libquery_engine-darwin.dylib.node`,
	},
	darwinArm64: {
		migrationEngine: `${
			app.isPackaged ? 'app.asar.unpacked/' : ''
		}node_modules/@prisma/engines/migration-engine-darwin-arm64`,
		queryEngine: `${
			app.isPackaged ? 'app.asar.unpacked/' : ''
		}node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node`,
	},
}

//

function getPlatformName(): string {
	const isDarwin = process.platform === 'darwin'
	if (isDarwin && process.arch === 'arm64') {
		return process.platform + 'Arm64'
	}

	return process.platform
}
const platformName = getPlatformName()
const extraResourcesPath = app.getAppPath().replace('app.asar', '') // impacted by extraResources setting in electron-builder.yml
export const mePath = path.join(extraResourcesPath, platformToExecutables[platformName].migrationEngine)
export const qePath = path.join(extraResourcesPath, platformToExecutables[platformName].queryEngine)

//

export interface Migration {
	id: string
	checksum: string
	finished_at: string
	migration_name: string
	logs: string
	rolled_back_at: string
	started_at: string
	applied_steps_count: string
}
