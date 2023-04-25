import child_process from 'child_process'
import { EventEmitter } from 'events'
import path from 'path'
import fs from 'fs'
import { is } from '@electron-toolkit/utils'
import { GeneralMessage, IpcMessage } from '@cryptobot/shared/src/front-desktop/preload/IpcMessage.types'

export class BackgroundProcess<T extends IpcMessage> {
	private timerId?: NodeJS.Timer
	private process?: child_process.ChildProcess
	private readonly _name: string
	private readonly _emitter: EventEmitter
	private readonly logFile: string = ''

	constructor(name: string, userDataPath: string) {
		this._name = name.replaceAll(/[^a-zA-Z0-9]/g, '')
		fs.mkdirSync(path.join(userDataPath, 'logs'), { recursive: true })
		this.logFile = path.join(userDataPath, `logs/${this._name}.log`)
		this._emitter = new EventEmitter()
		this.start()
	}

	start(): void {
		let scriptPath = ''
		if (is.dev) {
			scriptPath = path.join(__dirname, `${this._name}.js`)
		} else {
			scriptPath = path.join(__dirname, '../../../', 'app.asar.unpacked', 'out', 'main', `${this._name}.js`)
		}

		this.log(`Starting ${this._name} process at ${scriptPath}`)

		if (fs.existsSync(scriptPath)) {
			this.process = child_process.fork(scriptPath, {
				stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
			})

			this.log(`Started ${this._name} process on PID ${this.process?.pid}`)

			this.process.on('message', (message: T) => {
				this._emitter.emit('message', message)

				switch (message.type) {
					case 'log':
						break
					case 'error':
						break
				}
			})
		}
	}

	ping(): boolean {
		const message: GeneralMessage = {
			type: 'ping',
		}

		try {
			const success = !!this.process?.send(message, () => {})
			return success
		} catch (error) {
			console.log('Error sending ping message', error)
			return false
		}
	}

	send(message: T): void {
		this.log('Send message', JSON.stringify(message.type))
		this.process?.send(message)
	}

	stop(): void {
		console.log('Stopping portfolio process')
		if (this.timerId) clearInterval(this.timerId)
		this.process?.off('message', () => {})
		this.process?.kill()
	}

	log(message: string, ...args: string[]): void {
		message = `[${new Date().toISOString()}] ${message} ${args.join(' ')}\n`
		fs.appendFileSync(this.logFile, message, { flag: 'a+', encoding: 'utf8' })
		console.log(message)
		this.truncateLog()
	}

	truncateLog(): void {
		const MAX_LOG_SIZE = 1_000_000 // 1 Mo
		const fileStats = fs.statSync(this.logFile)
		if (fileStats.size > MAX_LOG_SIZE) {
			const fileData = fs.readFileSync(this.logFile, 'utf8')
			const newData = fileData.substring(fileData.length - MAX_LOG_SIZE)
			fs.writeFileSync(this.logFile, newData)
		}
	}

	on(event: 'message', listener: (message: T) => void): void {
		this._emitter.on(event, listener)
	}

	removeListener(event: 'message', listener: (message: T) => void): void {
		this._emitter.removeListener(event, listener)
	}
}
