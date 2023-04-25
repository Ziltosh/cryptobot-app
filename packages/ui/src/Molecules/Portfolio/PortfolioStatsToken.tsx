import '../../index.css'
import React from 'react'
import { Currency } from '../../Atoms/Currency/Currency'
import { Percent } from '../../Atoms/Percent/Percent'
import { LogoItem } from '../../Atoms/LogoItem/LogoItem'
import {
	PortfolioTokensLocalDB,
	PortfolioTokenStatsData,
} from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'
import { BlockchainDB, ExchangeDB } from '@cryptobot/shared/src/prisma-types/db-api/DB.types'
import { first } from 'blinkdb'
import { portfolioTokenTable } from '@cryptobot/shared/src/blink/Portfolio'

type PresetProps = {
	default: {
		tokenStats: PortfolioTokenStatsData
		isStable?: boolean
	}
}

type Preset = keyof PresetProps

type Props<P extends Preset> = PresetProps[P] & {
	preset: P
}

// const baseClasses = ['w-full table-fixed']

// const classes: Record<keyof PresetProps, string[]> = {
// 	default: [...baseClasses, ''],
// 	edit: [...baseClasses, ''],
// }

export const PortfolioStatsToken = <P extends Preset>(props: Props<P>) => {
	// const classesToApply = twMerge(classes[props.preset || 'default'])

	const [blockchains, setBlockchains] = React.useState<BlockchainDB[]>([])
	const [exchanges, setExchanges] = React.useState<ExchangeDB[]>([])
	const [token, setToken] = React.useState<PortfolioTokensLocalDB | null>(null)

	React.useEffect(() => {
		setBlockchains(props.tokenStats._blockchains || [])
		setExchanges(props.tokenStats._exchanges || [])
		// 	getBlockchainsForToken(props.tokenStats.id).then((blockchains) => {
		// 		setBlockchains(blockchains)
		// 	})
		// 	getExchangesForToken(props.tokenStats.id).then((exchanges) => {
		// 		setExchanges(exchanges)
		// 	})
		first(portfolioTokenTable, {
			where: {
				id: props.tokenStats.id,
			},
		}).then((token) => {
			setToken(token)
		})
	}, [])

	if (props.preset === 'default') {
		const castProps = props as Props<'default'>
		const chiffresVirgules = Math.ceil(castProps.tokenStats.prixActuel).toString().length

		return (
			<tr className={`align-middle border-dotted border-b-[1px]`}>
				<td className={'p-1'}>
					<LogoItem
						data={token?._tokenApiData || null}
						preset={'token'}
						name={token?._tokenApiData?.symbol.toUpperCase() || ''}
						withText
					/>
					{props.isStable && (
						<div
							className={
								'text-xs px-2 font-medium py-1 mt-1 rounded-md bg-slate-100 uppercase text-slate-500 w-fit'
							}
						>
							stablecoin
						</div>
					)}
				</td>
				<td className={'p-1'}>
					<Currency
						value={props.tokenStats.prixActuel}
						preset={'default'}
						fractionDigits={chiffresVirgules}
					/>
				</td>
				<td className={'p-1'}>
					<Currency
						value={props.tokenStats.valeurActuelle}
						preset={'default'}
						fractionDigits={chiffresVirgules}
					/>
					<span className={'italic text-sm'}>
						{Intl.NumberFormat('fr-FR', {
							minimumFractionDigits: chiffresVirgules,
						}).format(castProps.tokenStats.quantiteActuelle)}
						&nbsp;
						{token?._tokenApiData?.symbol.toUpperCase()}
					</span>
				</td>
				<td className={'p-1'}>
					<Currency value={props.tokenStats.valeurIn} preset={'default'} fractionDigits={chiffresVirgules} />
					<span className={'italic text-sm'}>
						{Intl.NumberFormat('fr-FR', { maximumFractionDigits: chiffresVirgules }).format(
							castProps.tokenStats.quantiteIn
						)}
						&nbsp;
						{token?._tokenApiData?.symbol.toUpperCase()}
					</span>
				</td>
				<td className={'p-1'}>
					<Currency value={props.tokenStats.valeurOut} preset={'default'} fractionDigits={chiffresVirgules} />
					<span className={'italic text-sm'}>
						{Intl.NumberFormat('fr-FR', { maximumFractionDigits: chiffresVirgules }).format(
							castProps.tokenStats.quantiteOut
						)}
						&nbsp;
						{token?._tokenApiData?.symbol.toUpperCase()}
					</span>
				</td>

				{/*<td className={'p-1'}>*/}
				{/*	<Currency value={props.tokenStats.feesValue} preset={'default'} fractionDigits={chiffresVirgules} />*/}
				{/*	<span className={'italic text-sm'}>*/}
				{/*		{Intl.NumberFormat('fr-FR', { maximumFractionDigits: chiffresVirgules }).format(*/}
				{/*			castProps.tokenStats.feesQte*/}
				{/*		)}*/}
				{/*		&nbsp;*/}
				{/*		{token?._tokenApiData.symbol.toUpperCase()}*/}
				{/*	</span>*/}
				{/*</td>*/}

				<td className={'p-1'}>
					<Currency
						enableBlur={false}
						value={props.tokenStats.pru}
						preset={'default'}
						fractionDigits={chiffresVirgules}
					/>
				</td>
				<td className={'p-1 flex flex-row flex-wrap'}>
					{blockchains.map((blockchain, index) => (
						<LogoItem
							key={`blockchain-${index}`}
							data={blockchain}
							preset={'blockchain'}
							withText={false}
							name={blockchain?.name || ''}
						/>
					))}
					{exchanges.map((exchange, index) => (
						<LogoItem
							key={`exchange-${index}`}
							data={exchange}
							preset={'exchange'}
							withText={false}
							name={exchange?.name || ''}
						/>
					))}
				</td>
				<td className={'p-1'}>
					<Percent value={props.tokenStats.allocationPct} preset={'default'} />
				</td>
				<td className={'p-1'}>
					<Percent colored value={props.tokenStats.evolutionPct} preset={'default'} />
					<span className={'text-xs'}>
						<Currency colored value={props.tokenStats.evolutionValeur} />
					</span>
				</td>
			</tr>
		)
	} else {
		return <></>
	}
}
