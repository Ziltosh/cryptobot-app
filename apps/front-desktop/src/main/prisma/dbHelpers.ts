import fs from 'fs'
import { dbUserPath } from './vars'

export const dbCopy = (): void => {
	const dbPath = require.resolve(`db-user/prisma/user.sqlite`)
	fs.writeFileSync(dbUserPath, fs.readFileSync(dbPath))
}
