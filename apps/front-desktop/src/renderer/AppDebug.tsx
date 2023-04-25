// import { remote } from 'electron'

import React from 'react'
import { JSONTree } from 'react-json-tree'
import { usePortfolios } from '@cryptobot/shared/src/hooks/blink/portfolio'
import { watch } from 'blinkdb'
import { portfolioTokenTable } from '@cryptobot/shared/src/blink/Portfolio'
import { PortfolioTokensLocalDB } from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'

function AppDebug(): JSX.Element {
	const { portfolios } = usePortfolios()
	watch(portfolioTokenTable, (tokens) => {
		setAllTokens(tokens)
	}).then((_r) => null)

	const [allTokens, setAllTokens] = React.useState<PortfolioTokensLocalDB[]>([])

	React.useEffect(() => {
		const interval = setInterval(async () => {
			// const logs = await window.systemApi.getProcessLogs({ process: 'portfolio' })
			// setPortfolioLog(logs)
		}, 1000)

		return () => {
			clearTimeout(interval)
		}
	}, [])

	return (
		<div className="flex flex-row flex-auto h-screen w-screen">
			<div className={'overflow-y-auto text-xs'}>
				portfolios: <JSONTree data={portfolios} />
				tokens: <JSONTree data={allTokens} />
			</div>

			{/*<div className={'overflow-y-scroll w-1/2'}>*/}
			{/*	{portfolioLog*/}
			{/*		.reverse()*/}
			{/*		.slice(0, 40)*/}
			{/*		.map((log, index) => (*/}
			{/*			<>*/}
			{/*				<span className={'text-xs'} key={index}>*/}
			{/*					{log}*/}
			{/*				</span>*/}
			{/*				<br />*/}
			{/*			</>*/}
			{/*		))}*/}
			{/*</div>*/}
		</div>
	)
}

export default AppDebug
