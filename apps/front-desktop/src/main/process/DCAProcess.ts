import { BackgroundProcess } from './BackgroundProcess'
import { PrismaClient } from '.prisma/client'
import { DCAMessage } from '@cryptobot/shared/src/front-desktop/preload/IpcMessage.types'

export class DcaProcess extends BackgroundProcess<DCAMessage> {
	//@ts-ignore a enlever quand on s'occupera de la gestion du dca
	private readonly prisma: PrismaClient

	constructor(prismaClient: PrismaClient, userDataPath: string) {
		super('dca', userDataPath)

		this.prisma = prismaClient

		this.on('message', (message: DCAMessage) => {
			switch (message.type) {
				default: {
				}
			}
		})
	}

	actionStart(): void {
		const message: DCAMessage = {
			type: 'action:start',
			data: 'start',
		}
		this.send(message)
	}
}
