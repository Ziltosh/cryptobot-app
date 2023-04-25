import { Button, Text } from '@cryptobot/ui'
import { useNavigate } from 'react-router-dom'
import { PortfolioStat } from '@cryptobot/ui/src/Molecules/Portfolio/PortfolioStat'
import { PortfolioStatsTokens } from '@cryptobot/ui/src/Molecules/Portfolio/PortfolioStatsTokens'
import { PortfolioStatsToken } from '@cryptobot/ui/src/Molecules/Portfolio/PortfolioStatsToken'
import { MdRefresh } from 'react-icons/all'
import React from 'react'
import {
	getCexOnchainRatio,
	getDefiWalletRatio,
	getStableVolatileRatio,
	importPortfolio,
} from '../helpers/portfolio.fn'

// import the core library.
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import ReactEChartsCore, { EChartsOption } from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { DatasetComponent, GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { useMiscStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/MiscStore'
import { useUserStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/UserStore'
import { generateChartOptions } from './PortfolioShow.helpers'
import { usePortfolios, usePortfoliosStats, usePortfolioTokens } from '@cryptobot/shared/src/hooks/blink/portfolio'

echarts.use([
	PieChart,
	CanvasRenderer,
	DatasetComponent,
	GridComponent,
	TooltipComponent,
	TitleComponent,
	LegendComponent,
])

const PortfolioShow = (): JSX.Element => {
	document.title = 'Vue portfolio'

	type tabs = 'tokens' | 'wallets' | 'blockchains' | 'exchanges'

	const navigate = useNavigate()

	// const portfolioStore = usePortfolioStore()
	const userStore = useUserStore()
	const miscStore = useMiscStore()

	const { currentPortfolio } = usePortfolios()
	const { portfolioTokens } = usePortfolioTokens()
	const { stats } = usePortfoliosStats()

	const [isUpdating, setIsUpdating] = React.useState(false)
	const [optionsStableVolatileRatio, setOptionsStableVolatileRatio] = React.useState<EChartsOption>({})
	const [optionsCexOnchain, setOptionsCexOnchain] = React.useState<EChartsOption>({})
	const [optionsDefiWallet, setOptionsDefiWallet] = React.useState<EChartsOption>({})
	const [optionsTokens, setOptionsTokens] = React.useState<EChartsOption>([])
	const [optionsWallets, setOptionsWallets] = React.useState<EChartsOption>([])
	const [optionsBlockchains, setOptionsBlockchains] = React.useState<EChartsOption>([])
	const [optionsExchanges, setOptionsExchanges] = React.useState<EChartsOption>([])
	const [currentTab, setCurrentTab] = React.useState<tabs>('tokens')

	React.useEffect(() => {
		getStableVolatileRatio().then((res) => {
			setOptionsStableVolatileRatio(
				generateChartOptions(
					{ name: 'Stable', value: res.stablecoin },
					{ name: 'Volatile', value: res.volatile }
				)
			)
		})
		getCexOnchainRatio().then((res) => {
			setOptionsCexOnchain(
				generateChartOptions({ name: 'CEX', value: res.cex }, { name: 'Onchain', value: res.onchain })
			)
		})
		getDefiWalletRatio().then((res) => {
			setOptionsDefiWallet(
				generateChartOptions({ name: 'DEFI', value: res.defi }, { name: 'Wallet', value: res.wallet })
			)
		})

		if (stats.tokens.length > 0)
			setOptionsTokens(
				generateChartOptions(
					...stats.tokens
						.filter((t) => t.allocationPct > 0.05)
						.map((token) => ({ name: token.name, value: token.valeurActuelle }))
				)
			)

		if (stats.wallets.length > 0)
			setOptionsWallets(
				generateChartOptions(
					...stats.wallets.map((wallet) => ({ name: wallet.name, value: wallet.valeurActuelle }))
				)
			)

		if (stats.blockchains.length > 0)
			setOptionsBlockchains(
				generateChartOptions(
					...stats.blockchains.map((blockchain) => ({
						name: blockchain.name,
						value: blockchain.valeurActuelle,
					}))
				)
			)

		if (stats.exchanges.length > 0)
			setOptionsExchanges(
				generateChartOptions(
					...stats.exchanges.map((exchange) => ({
						name: exchange.name,
						value: exchange.valeurActuelle,
					}))
				)
			)

		setIsUpdating(currentPortfolio?.isUpdating || false)

		console.log('useCallback currentPortfolio', currentPortfolio)
	}, [currentPortfolio, stats])

	React.useEffect(() => {
		const interval = setInterval(() => {
			console.log('isUpdating interval', isUpdating)
			if (isUpdating) {
				;(async (): Promise<void> => {
					if (currentPortfolio) {
						const portfolioDb = await window.localDbApi.getPortfolio({
							portfolioId: currentPortfolio.id,
						})
						if (portfolioDb) {
							if (!portfolioDb.isUpdating) {
								setIsUpdating(false)
								await importPortfolio({
									portfolio: currentPortfolio,
								})
							} else {
								setIsUpdating(true)
							}
						}
					}
				})()
			} else {
				clearInterval(interval)
			}
		}, 1000)

		return () => clearInterval(interval)
	}, [isUpdating])

	const handleModifier = (): void => {
		navigate(miscStore.returnToPortfolio, { replace: true })
	}

	const handleRevenir = (): void => {
		navigate('/portfolio', { replace: true })
	}

	const handleUpdate = async (): Promise<void> => {
		if (currentPortfolio) {
			setIsUpdating(true)

			if (userStore.userToken) {
				await window.portfolioProcessApi.updateAll({
					portfolio: currentPortfolio,
					userToken: userStore.userToken.token,
				})
			} else {
				await window.portfolioProcessApi.updateTokens({ portfolio: currentPortfolio })
			}
		}
	}

	return (
		<div className="flex flex-col">
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={`Détails du portfolio : ${currentPortfolio?.name}`} />
				<Text preset={'breadcrumb'} text={`Cryptobot > Portfolios > Détails`} />
			</div>

			<Text preset={'h2'} text={'Vue générale'} />
			<div className="flex flex-col w-full mb-4">
				<div className="flex">
					<PortfolioStat value={stats.portfolio.valeurActuelle || 0} text={'portfolio'} preset={'currency'} />
					{/*<PortfolioStat value={stats.defi || 0} text={'DEFI'} preset={'currency'} />*/}
					<PortfolioStat
						value={stats.tokens.filter((t) => t.valeurActuelle > 0.1).length || 0}
						text={'token(s)'}
						preset={'default'}
					/>
					<PortfolioStat value={stats.wallets.length || 0} text={'wallet(s)'} preset={'default'} />
					<PortfolioStat value={stats.exchanges.length} text={'exchange(s)'} preset={'default'} />
					<PortfolioStat value={stats.blockchains.length || 0} text={'blockchain(s)'} preset={'default'} />
					<PortfolioStat
						value={stats.portfolio.nbTransactions || 0}
						text={'transaction(s)'}
						preset={'default'}
					/>
				</div>
				<div className="w-12/12 flex flex-row">
					<div className="w-4/12">
						<ReactEChartsCore
							echarts={echarts}
							option={optionsStableVolatileRatio}
							notMerge={true}
							lazyUpdate={true}
						/>
					</div>
					<div className="w-4/12">
						<ReactEChartsCore
							echarts={echarts}
							option={optionsCexOnchain}
							notMerge={true}
							lazyUpdate={true}
						/>
					</div>
					<div className="w-4/12">
						<ReactEChartsCore
							echarts={echarts}
							option={optionsDefiWallet}
							notMerge={true}
							lazyUpdate={true}
						/>
					</div>
				</div>
			</div>
			<Text preset={'h2'} text={'Vue détaillée'} />
			<Text preset={'h3'} text={'Remarques'} />
			<p className={'mb-1'}>L’évolution indiquée dans les tableaux ci-dessous se base sur </p>
			<ul className={'list-disc list-inside mb-4'}>
				<li>les différentes valeurs des transactions renseignées manuellement pour les custom tokens</li>{' '}
				<li>l’historique des transactions pour les tokens ERC20 des wallets</li>
				<li>
					la balance actuelle pour les tokens natifs des blockchains (sera possiblement changé dans de
					prochaines mises à jour)
				</li>
				<li>
					les balances actuelles pour les exchanges, à noter qu&apos;une prise en compte des trades sera
					possible dans une mise à jour ultérieure
				</li>
			</ul>

			<div className="flex mb-3">
				<div
					className={`grow cursor-pointer text-center border border-amber-500 border-collapse font-bold ${
						currentTab === 'tokens' ? 'bg-amber-500 text-white' : 'text-slate-700'
					}`}
					onClick={(): void => setCurrentTab('tokens')}
				>
					Tokens
				</div>
				{stats.wallets.length > 0 && (
					<div
						className={`grow cursor-pointer text-center border border-amber-500 border-collapse font-bold ${
							currentTab === 'wallets' ? 'bg-amber-500 text-white' : 'text-slate-700'
						}`}
						onClick={(): void => setCurrentTab('wallets')}
					>
						Wallets
					</div>
				)}
				{stats.blockchains.length > 0 && (
					<div
						className={`grow cursor-pointer text-center border border-amber-500 border-collapse font-bold ${
							currentTab === 'blockchains' ? 'bg-amber-500 text-white' : 'text-slate-700'
						}`}
						onClick={(): void => setCurrentTab('blockchains')}
					>
						Blockchains
					</div>
				)}
				<div
					className={`grow cursor-pointer text-center border border-amber-500 border-collapse font-bold ${
						currentTab === 'exchanges' ? 'bg-amber-500 text-white' : 'text-slate-700'
					}`}
					onClick={(): void => setCurrentTab('exchanges')}
				>
					Exchanges
				</div>
			</div>

			{currentTab === 'tokens' && (
				<>
					<ReactEChartsCore echarts={echarts} option={optionsTokens} notMerge={true} lazyUpdate={true} />
					<PortfolioStatsTokens preset={'default'}>
						{stats.tokens
							?.filter((tokenStats) => tokenStats.valeurActuelle > 0.1)
							?.sort((a, b) => b.valeurActuelle - a.valeurActuelle)
							.map((tokenStats, index) => (
								<PortfolioStatsToken
									key={`token-${index}`}
									tokenStats={tokenStats}
									preset={'default'}
									isStable={
										portfolioTokens.find((t) => t.id === tokenStats.id)?._tokenApiData?.custom_data
											?.is_usd_stablecoin ||
										portfolioTokens.find((t) => t.id === tokenStats.id)?._tokenApiData?.custom_data
											?.is_eur_stablecoin
									}
								/>
							))}
					</PortfolioStatsTokens>
				</>
			)}

			{currentTab === 'wallets' && (
				<>
					<ReactEChartsCore echarts={echarts} option={optionsWallets} notMerge={true} lazyUpdate={true} />
					{stats.wallets.map((walletStats, index) => (
						<>
							<Text
								key={`wallet-${index}`}
								preset={'h3'}
								text={`${walletStats.name} (${walletStats.address})`}
							/>
							<PortfolioStatsTokens preset={'default'}>
								{walletStats.tokens
									// ?.filter((tokenStats) => tokenStats.valeurActuelle > 0.1)
									?.sort((a, b) => b.valeurActuelle - a.valeurActuelle)
									.map((tokenStats, index) => (
										<PortfolioStatsToken
											key={`token-${index}`}
											tokenStats={tokenStats}
											preset={'default'}
											isStable={
												portfolioTokens.find((t) => t.id === tokenStats.id)?._tokenApiData
													?.custom_data?.is_usd_stablecoin ||
												portfolioTokens.find((t) => t.id === tokenStats.id)?._tokenApiData
													?.custom_data?.is_eur_stablecoin
											}
										/>
									))}
							</PortfolioStatsTokens>
						</>
					))}
				</>
			)}

			{currentTab === 'blockchains' && (
				<>
					<ReactEChartsCore echarts={echarts} option={optionsBlockchains} notMerge={true} lazyUpdate={true} />
					{stats.blockchains.map((blockchainStats, index) => (
						<>
							<Text key={`wallet-${index}`} preset={'h3'} text={`${blockchainStats.name}`} />
							<PortfolioStatsTokens preset={'default'}>
								{blockchainStats.tokens
									// ?.filter((tokenStats) => tokenStats.valeurActuelle > 0.1)
									?.sort((a, b) => b.valeurActuelle - a.valeurActuelle)
									.map((tokenStats, index) => (
										<PortfolioStatsToken
											key={`token-${index}`}
											tokenStats={tokenStats}
											preset={'default'}
											isStable={
												portfolioTokens.find((t) => t.id === tokenStats.id)?._tokenApiData
													?.custom_data?.is_usd_stablecoin ||
												portfolioTokens.find((t) => t.id === tokenStats.id)?._tokenApiData
													?.custom_data?.is_eur_stablecoin
											}
										/>
									))}
							</PortfolioStatsTokens>
						</>
					))}
				</>
			)}

			{currentTab === 'exchanges' && (
				<>
					<ReactEChartsCore echarts={echarts} option={optionsExchanges} notMerge={true} lazyUpdate={true} />
					{stats.exchanges.map((exchangeStats, index) => (
						<>
							<Text key={`wallet-${index}`} preset={'h3'} text={`${exchangeStats.name}`} />
							<PortfolioStatsTokens preset={'default'}>
								{exchangeStats.tokens
									// ?.filter((tokenStats) => tokenStats.valeurActuelle > 0.1)
									?.sort((a, b) => b.valeurActuelle - a.valeurActuelle)
									.map((tokenStats, index) => (
										<PortfolioStatsToken
											key={`token-${index}`}
											tokenStats={tokenStats}
											preset={'default'}
											isStable={
												portfolioTokens.find((t) => t.id === tokenStats.id)?._tokenApiData
													?.custom_data?.is_usd_stablecoin ||
												portfolioTokens.find((t) => t.id === tokenStats.id)?._tokenApiData
													?.custom_data?.is_eur_stablecoin
											}
										/>
									))}
							</PortfolioStatsTokens>
						</>
					))}
				</>
			)}

			<Text preset={'h2'} text={'DEFI'} />
			<Text preset={'h3'} text={'Sera disponible dans la version 5.0'} />

			<div className="flex w-full items-center justify-center gap-4">
				<Button text={'Revenir'} preset={'cancel'} onPress={handleRevenir} />
				<Button
					text={'Mettre à jour'}
					preset={'default'}
					icon={<MdRefresh />}
					onPress={handleUpdate}
					disabled={isUpdating}
				/>
				<Button
					text={'Modifier le portfolio'}
					preset={'default'}
					disabled={isUpdating}
					onPress={handleModifier}
				/>
			</div>
		</div>
	)
}

export default PortfolioShow
