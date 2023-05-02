import { Content, Footer, Header, Icon, Sidebar, Status, Text } from "@cryptobot/ui";
import { Link, Outlet, useNavigate } from "react-router-dom";
import React from "react";
import { FaCalculator, FaRobot, GrTest, IoMdWallet, MdDashboard } from "react-icons/all";
import { ProcessStatus } from "@cryptobot/shared/src/front-desktop/preload/Process.types";
import { useLogStore } from "@cryptobot/shared/src/front-desktop/renderer/stores/LogStore";
import { useUserStore } from "@cryptobot/shared/src/front-desktop/renderer/stores/UserStore";
// import { ipcRenderer } from 'electron'

// import { remote } from 'electron'

function App(): JSX.Element {
	const navigate = useNavigate()

	const userStore = useUserStore()
	const logStore = useLogStore()

	const [version, setVersion] = React.useState('')
	const [isDev, setIsDev] = React.useState(false)
	const [processStatus, setProcessStatus] = React.useState<ProcessStatus>({
		portfolio: false,
		dca: false,
		bots: false,
	})
	const [apiOnline, setApiOnline] = React.useState(false)

	let intervalStatus: NodeJS.Timer
	React.useEffect(() => {
		window.systemApi.getAppVersion().then((version) => {
			setVersion(version)
		})

		window.systemApi.getIsDev().then((isDev) => {
			setIsDev(isDev)
		})

		intervalStatus = setInterval(() => {
			window.systemApi.getProcessesStatus().then((processes) => {
				setProcessStatus(processes)
			})

			window.dbApi.ping().then((ping) => {
				setApiOnline(ping)
			})
		}, 4000)

		return () => {
			clearInterval(intervalStatus)
		}
	}, [])

	React.useEffect(() => {
		window.addEventListener('message', handleLog)

		return () => {
			window.removeEventListener('message', handleLog)
		}
	}, [])

	const handleLog = (event: MessageEvent): void => {
		if (event.data.type === 'mainMsg:log:portfolio') {
			logStore.addToPortfolio(event.data.data)
		}
	}

	const handleClickUser = (): void => {
		if (userStore.user) {
			navigate('/account')
		} else {
			navigate('/login')
		}
	}

	return (
		<div className="flex flex-col flex-auto h-screen">
			<div className="grow-O">
				<Header onClickUser={handleClickUser} />
			</div>
			<div className="content-sidebar">
				<Sidebar>
					<Link to={'/'}>
						<Icon flex={'col'} icon={<MdDashboard size={22} />} text={'Dashboard'} />
					</Link>
					<Link to={'/bots'}>
						<Icon flex={'col'} icon={<FaRobot size={22} />} text={'Bots'} />
					</Link>
					<Link to={'/dca'}>
						<Icon flex={'col'} icon={<FaCalculator size={22} />} text={'DCA'} />
					</Link>
					<Link to={'/portfolio'}>
						<Icon flex={'col'} icon={<IoMdWallet size={22} />} text={'Portfolio'} />
					</Link>
					{isDev && (
						<Link to={'/tests'}>
							<Icon flex={'col'} icon={<GrTest size={22} />} text={'Tests'} />
						</Link>
					)}
				</Sidebar>
				<Content>
					<div className="grow p-4 max-h-full overflow-y-scroll flex flex-col">
						<Outlet />
					</div>
					<Footer>
						<Text preset={'footer'} text={version} />
						<div className={'flex flex-row items-center'}>
							<Status isOk={apiOnline} name={'api'} />
							<Status isOk={processStatus.portfolio} name={'portfolio'} />
							<Status isOk={processStatus.dca} name={'dca'} />
							<Status isOk={processStatus.bots} name={'bots'} />
						</div>
						<Text preset={'footer'} text={`${new Date().getFullYear()} © Cryptobot`} />
					</Footer>
				</Content>
			</div>
		</div>
	)
}

export default App
