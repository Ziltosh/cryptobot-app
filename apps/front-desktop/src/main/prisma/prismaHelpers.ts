import fs from 'fs'
import { fork } from 'child_process'
import { dbUserPath, mePath, Migration, qePath } from './vars'
import path from 'path'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import { initPrismaClient } from './initPrismaClient'

// Hacky, but putting this here because otherwise at query time the Prisma client
// gives an error "Environment variable not found: DATABASE_URL" despite us passing
// the dbUrl into the prisma client constructor in datasources.db.url
process.env.DATABASE_URL = ''

const prisma = initPrismaClient()

export const findLatestMigrationName = (): string => {
	let dir: string

	if (!is.dev) {
		dir = path.join(app.getAppPath().replace('app.asar', 'app.asar.unpacked'), 'prisma', 'migrations')
	} else {
		dir = path.join(__dirname, '../../prisma', 'migrations')
	}

	const files = fs.readdirSync(dir, { withFileTypes: true })
	const dirs = files.filter((f) => f.isDirectory()).map((f) => f.name)

	// console.log(dirs[dirs.length - 1])
	// throw new Error('test')

	return dirs[dirs.length - 1]
}

export const checkMigration = async (): Promise<void> => {
	let needsMigration
	let noDbFile = false
	const latestMigration = findLatestMigrationName()
	const dbExists = fs.existsSync(dbUserPath) && fs.statSync(dbUserPath).size > 0
	if (!dbExists) {
		needsMigration = true

		noDbFile = true

		// prisma for whatever reason has trouble if the database file does not exist yet.
		// So just touch it here
		fs.closeSync(fs.openSync(dbUserPath, 'w'))
	} else {
		try {
			const latest: Migration[] = await prisma.$queryRaw`select * from _prisma_migrations order by finished_at`
			needsMigration = latest[latest.length - 1]?.migration_name !== latestMigration
		} catch (e) {
			console.error(e)
			needsMigration = true
		}
	}

	if (needsMigration) {
		try {
			// const schemaPath = path.join(__dirname, 'prisma/schema.prisma')
			const schemaPath = path.join(
				app.getAppPath().replace('app.asar', 'app.asar.unpacked'),
				'prisma',
				'schema.prisma'
			)
			console.info(`Needs a migration. Running prisma migrate with schema path ${schemaPath}`)

			if (noDbFile) {
				const sqlPath = path.join(
					app.getAppPath().replace('app.asar', 'app.asar.unpacked'),
					'prisma',
					'user.sqlite'
				)

				console.info(`No db file, copy from app.asar.unpacked to user data path ${dbUserPath}`)

				fs.copyFileSync(sqlPath, dbUserPath)

				// await runPrismaCommand({
				// 	// migrate diff --preview-feature --from-empty --to-schema-datamodel prisma/schema.prisma --script
				// 	command: ['db', 'execute', '--file', sqlPath, '--schema', schemaPath],
				// 	dbUrl: `file:${dbUserPath}`,
				// })
				// console.info('Execute done.')
			}
			// } else {
			// first create or migrate the database! If you were deploying prisma to a cloud service, this migrate deploy
			// command you would run as part of your CI/CD deployment. Since this is an electron app, it just needs
			// to run every time the production app is started. That way if the user updates the app and the schema has
			// changed, it will transparently migrate their DB.
			await runPrismaCommand({
				command: ['migrate', 'deploy', '--schema', schemaPath],
				dbUrl: `file:${dbUserPath}`,
			})
			console.info('Migration done.')
			// }

			// seed
			// console.info("Seeding...");
			// await seed(prisma);
		} catch (e) {
			console.error(e)
			process.exit(1)
		}
	} else {
		console.info('Does not need migration')
	}
}

export async function runPrismaCommand({ command, dbUrl }: { command: string[]; dbUrl: string }): Promise<number> {
	console.info('Migration engine path', mePath)
	console.info('Query engine path', qePath)
	console.info('Database path', dbUrl)

	// Currently we don't have any direct method to invoke prisma migration programatically.
	// As a workaround, we spawn migration script as a child process and wait for its completion.
	// Please also refer to the following GitHub issue: https://github.com/prisma/prisma/issues/4703
	try {
		const exitCode = await new Promise((resolve, _) => {
			const prismaPath = require.resolve(`prisma/build/index.js`)
			console.info('Prisma path', prismaPath)

			const child = fork(prismaPath, command, {
				env: {
					...process.env,
					DATABASE_URL: dbUrl,
					PRISMA_MIGRATION_ENGINE_BINARY: mePath,
					PRISMA_QUERY_ENGINE_LIBRARY: qePath,

					// Prisma apparently needs a valid path for the format and introspection binaries, even though
					// we don't use them. So we just point them to the query engine binary. Otherwise, we get
					// prisma:  Error: ENOTDIR: not a directory, unlink '/some/path/electron-prisma-trpc-example/packed/mac-arm64/ElectronPrismaTrpcExample.app/Contents/Resources/app.asar/node_modules/@prisma/engines/prisma-fmt-darwin-arm64'
					PRISMA_FMT_BINARY: qePath,
					PRISMA_INTROSPECTION_ENGINE_BINARY: qePath,
				},
				stdio: 'pipe',
			})

			child.on('message', (msg) => {
				console.info(msg)
			})

			child.on('error', (err) => {
				console.error('Child process got error:', err)
			})

			child.on('close', (code, _signal) => {
				resolve(code)
			})

			child.stdout?.on('data', function (data) {
				console.info('prisma: ', data.toString())
			})

			child.stderr?.on('data', function (data) {
				console.error('prisma: ', data.toString())
			})
		})

		if (exitCode !== 0) throw Error(`command ${command} failed with exit code ${exitCode}`)

		return exitCode
	} catch (e) {
		console.error(e)
		throw e
	}
}
