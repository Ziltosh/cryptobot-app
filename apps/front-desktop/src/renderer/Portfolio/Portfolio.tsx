import {PortfolioItem, Text} from '@cryptobot/ui'
import {useNavigate} from 'react-router-dom'
import {PortfolioLimit} from '@cryptobot/ui/src/Molecules/Portfolio/PortfolioLimit'
import React from 'react'
import {PortfolioCloudDB} from '@cryptobot/shared/src/prisma-types/db-api/DB.types'
import {Portfolio as PortfolioLocalDB} from '.prisma/client'
import {useOfferStore} from '@cryptobot/shared/src/front-desktop/renderer/stores/OfferStore'
import {useUserStore} from '@cryptobot/shared/src/front-desktop/renderer/stores/UserStore'
import {useMiscStore} from '@cryptobot/shared/src/front-desktop/renderer/stores/MiscStore'
import {clear, insert, insertMany, remove, update} from 'blinkdb'
import {
	portfolioExchangeBalanceTable,
	portfolioExchangeTable,
	portfolioStatsTable,
	portfolioTable,
	portfolioTokenTable,
	portfolioWalletTable,
	portfolioWalletTransactionTable,
} from '@cryptobot/shared/src/blink/Portfolio'
import {importPortfolio} from '../helpers/portfolio.fn'
import {generateId} from '@cryptobot/shared/src/helpers/generateId.fn'
import {usePortfolios} from '@cryptobot/shared/src/hooks/blink/portfolio'

const Portfolio = (): JSX.Element => {
	document.title = 'Portfolio'

	// const portfolioStore = usePortfolioStore()
	const offerStore = useOfferStore()
	const userStore = useUserStore()
	const miscStore = useMiscStore()

	// const [refresh, setRefresh] = React.useState<boolean>(true)
	const { portfolios } = usePortfolios()

	React.useEffect(() => {
		;(async (): Promise<void> => {
			await window.dbApi.getOffers({ service: 'portfolio' }).then((offers) => {
				offerStore.setOffers(offers)
			})

			const portfolios = await window.localDbApi.getPortfolios()
			await clear(portfolioTable)
			await clear(portfolioTokenTable)
			await clear(portfolioWalletTable)
			await clear(portfolioWalletTransactionTable)
			await clear(portfolioTokenTable)
			await clear(portfolioStatsTable)
			await clear(portfolioExchangeTable)
			await clear(portfolioExchangeBalanceTable)
			await insertMany(portfolioTable, portfolios)
		})()
	}, [])

	const navigate = useNavigate()
	const handleAddPortfolio = async (): Promise<void> => {
		miscStore.setReturnToPortfolio('add')
		await insert(portfolioTable, {
			_isCurrent: true,
			id: generateId(10),
			PortfolioStats: [],
			_emplacement: 'local',
			name: `Portfolio #${generateId(4)}`,
			isUpdating: false,
			user_id: '',
			updatedAt: new Date(),
		})
		navigate('/portfolio/create', { replace: true })
	}

	const handleSelectPortfolio = async (portfolio: PortfolioLocalDB): Promise<void> => {
		await update(portfolioTable, { id: portfolio.id, _isCurrent: true })
		await importPortfolio({ portfolio })
		miscStore.setReturnToPortfolio('edit')
		navigate('/portfolio/show', { replace: true })
	}

	const handleDeletePortfolio = async (
		portfolio: PortfolioCloudDB | PortfolioLocalDB,
		emplacement: string
	): Promise<void> => {
		if (emplacement === 'cloud') {
			// await window.dbApi.deletePortfolio({ portfolioId: portfolio.id })
		} else {
			window.localDbApi.deletePortfolio({ portfolioId: portfolio.id })
			await remove(portfolioTable, { id: portfolio.id })
		}
	}

	// const handleUpdate = async (): Promise<void> => {
	// 	await window.portfolioProcessApi.updateAllPortfolios()
	// 	setUpdatingStats(true)
	// }

	return (
		<div className="flex flex-col">
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={'Portfolio'} />
				<Text preset={'breadcrumb'} text={`Cryptobot > Portfolios`} />
			</div>
			<Text preset={'h2'} text={'Limites'} />
			<div className={'flex flex-row justify-between mb-4'}>
				{offerStore.offers?.map((offer, id) => {
					const limit = offer.Limits?.find((l) => l.offerId === offer.id)
					if (limit) {
						return (
							<PortfolioLimit
								// preset={userStore.currentOffer === offer.name ? 'active' : 'default'}
								preset={userStore.user?.offer_id === offer.id ? 'active' : 'default'}
								key={id}
								limit={limit}
								offerName={offer.name}
							/>
						)
					}
					return <></>
				})}
			</div>
			<Text preset={'h2'} text={'Liste'} />
			<div className="flex gap-4 flex-wrap mb-4">
				{portfolios.map((pf, i) => {
					return (
						<PortfolioItem
							key={`pfl-${i}`}
							preset={'default'}
							name={pf.name}
							type={'local'}
							isUpdating={pf.isUpdating}
							stats={pf.PortfolioStats.slice(0, 1)}
							onClick={function (): Promise<void> {
								return handleSelectPortfolio(pf)
							}}
							onDelete={(): Promise<void> => handleDeletePortfolio(pf, 'local')}
						/>
					)
				})}

				{/*{portfoliosLocal.length + portfoliosServ.length < 1 && (*/}
				<PortfolioItem onClick={handleAddPortfolio} preset={'add'} />
				{/*)}*/}
			</div>

			{/*<div className="flex w-full items-center justify-center gap-4">*/}
			{/*	<Button*/}
			{/*		text={'Tout mettre à jour'}*/}
			{/*		preset={'default'}*/}
			{/*		icon={<MdRefresh />}*/}
			{/*		onPress={handleUpdate}*/}
			{/*		disabled={updatingStats || portfoliosLocal.length < 1}*/}
			{/*	/>*/}
			{/*</div>*/}
		</div>
	)
}

export default Portfolio
