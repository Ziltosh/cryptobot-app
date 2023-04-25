import { dbUserPath, qePath } from './vars'
import { PrismaClient } from '.prisma/client'

export const initPrismaClient = (): PrismaClient => {
	return new PrismaClient({
		log: [
			'info',
			'warn',
			'error',
			//     {
			//     emit: "event",
			//     level: "query",
			// },
		],
		datasources: {
			db: {
				url: `file:${dbUserPath}`,
			},
		},
		// see https://github.com/prisma/prisma/discussions/5200
		// @ts-expect-error internal prop
		__internal: {
			engine: {
				binaryPath: qePath,
			},
		},
	})
}
