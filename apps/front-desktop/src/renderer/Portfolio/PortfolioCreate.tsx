import { Button, Input, Label, PortfolioExchange, PortfolioWallet, Select, Text } from '@cryptobot/ui'
import React from 'react'
import { PortfolioToken } from '@cryptobot/ui/src/Molecules/Portfolio/PortfolioToken'
import { useNavigate } from 'react-router-dom'
import { OptionBase } from '@cryptobot/shared/src/ui/select/Option.types'
import {
	PortfolioExchangesLocalDB,
	PortfolioTokensLocalDB,
	PortfolioWalletsLocalDB,
} from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'
import { useUserStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/UserStore'
import { useOfferStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/OfferStore'
import { insert, remove, removeWhere, update } from 'blinkdb'
import {
	portfolioExchangeTable,
	portfolioTable,
	portfolioTokenTable,
	portfolioTokenTransactionTable,
	portfolioWalletTable,
} from '@cryptobot/shared/src/blink/Portfolio'
import {
	usePortfolioExchanges,
	usePortfolios,
	usePortfolioTokens,
	usePortfolioTokenTransactions,
	usePortfolioWallets,
} from '@cryptobot/shared/src/hooks/blink/portfolio'
import { generateId } from '@cryptobot/shared/src/helpers/generateId.fn'

const PortfolioCreate = (): JSX.Element => {
	document.title = 'Nouveau portfolio'

	const navigate = useNavigate()

	const userStore = useUserStore()
	const offerStore = useOfferStore()

	const { currentPortfolio } = usePortfolios()
	const { tokenTransactions } = usePortfolioTokenTransactions()
	const { portfolioTokens } = usePortfolioTokens()
	const { wallets } = usePortfolioWallets()
	const { exchanges } = usePortfolioExchanges()

	const [currentOffer, setCurrentOffer] = React.useState<string | null>('Invité')
	const [isLoading, setIsLoading] = React.useState<boolean>(false)

	React.useEffect(() => {
		if (userStore.user) {
			const offer = offerStore.offers.find((offer) => offer.id === userStore.user?.offer_id)
			if (offer) setCurrentOffer(offer.name)
		}
	}, [userStore.user, offerStore.offers])

	const handlePortfolioNameChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		console.log('handlePortfolioNameChange', e.target.value)
		if (currentPortfolio) {
			await update(portfolioTable, { id: currentPortfolio.id, name: e.target.value })
		}
	}

	const handleEmplacementChange = async (option: OptionBase | null): Promise<void> => {
		if (option && currentPortfolio)
			await update(portfolioTable, { id: currentPortfolio.id, _emplacement: option.value })
	}

	const handleValider = async (): Promise<void> => {
		setIsLoading(true)
		// if (portfolioStore.portfolios_current?._emplacement === 'local' && portfolioStore.portfolios_current) {
		await window.localDbApi.createPortfolio({
			portfolioData: currentPortfolio,
			tokenTransactionsData: tokenTransactions.filter((transaction) => transaction._isValidated),
			tokensData: portfolioTokens,
			walletsData: wallets,
			exchangesData: exchanges,
		})
		// }
		setIsLoading(false)
		navigate('/portfolio', { replace: true })
	}

	const handleAnnuler = (): void => {
		// portfolioStore.reset()
		navigate('/portfolio', { replace: true })
	}

	const handleDeleteCustomToken = async (token: PortfolioTokensLocalDB): Promise<void> => {
		await removeWhere(portfolioTokenTransactionTable, {
			where: {
				portfolio_token_id: token.id,
			},
		})
		await remove(portfolioTokenTable, { id: token.id })
	}

	const handleDeleteWallet = async (wallet: PortfolioWalletsLocalDB): Promise<void> => {
		await remove(portfolioWalletTable, { id: wallet.id })
	}

	const handleDeleteExchange = async (exchange: PortfolioExchangesLocalDB): Promise<void> => {
		await remove(portfolioExchangeTable, { id: exchange.id })
	}

	const handleAddToken = (): void => {
		navigate('/portfolio/add-token', { replace: true })
	}

	const handleSelectToken = async (token: PortfolioTokensLocalDB): Promise<void> => {
		console.log('handleSelectToken', token)
		await update(portfolioTokenTable, { id: token.id, _isCurrent: true })
		await insert(portfolioTokenTransactionTable, {
			portfolio_token_id: token.id,
			_apiTokenId: token.api_token_id,
			id: generateId(10),
			date: new Date().getTime(),
			_isValidated: false,
			type: 'in',
			quantite: 1,
			exchange_id: null,
			_isCurrent: true,
			blockchain_id: null,
			fee_quantite: 0,
			prix: 0,
			updatedAt: new Date(),
		})
		navigate('/portfolio/edit-token', { replace: true })
	}

	const handleAddWallet = (): void => {
		navigate('/portfolio/add-wallet', { replace: true })
	}

	const handleAddExchange = (): void => {
		navigate('/portfolio/add-exchange', { replace: true })
	}

	return (
		<div className="flex flex-col">
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={"Ajout d'un Portfolio"} />
				<Text preset={'breadcrumb'} text={`Cryptobot > Portfolios > Ajout`} />
			</div>
			<Text text={`Vous pouvez encore ajouter <strong>TODO</strong> portfolio`} preset={'default'} />

			<Text preset={'h2'} text={'Paramétrage'} />
			<div className="flex flex-row gap-4 items-center mb-3">
				<Label text={'Nom du portfolio :'} for={'name'} />
				<Input
					type={'text'}
					name={'name'}
					width={400}
					value={currentPortfolio?.name || ''}
					placeholder={'Mon portfolio'}
					onChange={handlePortfolioNameChange}
				/>
			</div>

			<div className="flex flex-row gap-4 items-center">
				<Label text={'Emplacement du portfolio :'} for={'type'} />
				<Select
					// selected={portfolioStore.emplacement}
					selected={'local'}
					options={[
						{ label: 'Local', value: 'local' },
						{ label: 'Cloud (sera dispo dans la version 4.0)', value: 'cloud', disabled: true },
					]}
					onChange={handleEmplacementChange}
					preset={'default'}
				/>
			</div>
			<div className={'mb-4 flex flex-row gap-4'}>
				<p>
					Si vous choisissez Local, le stockage et la mise à jour du portfolio se feront sur votre machine.
					<br />
					<strong>Avantage :</strong> Vous n&apos;avez pas besoin de stocker de clé API sur le serveur pour
					les exchanges.
					<br />
					<strong>Inconvénients:</strong> Vous devez laisser votre machine allumée et que le logiciel tourne
					en permanence pour que le portfolio se mette à jour.
					<br />
					Perte de données possible en cas de problème avec votre ordinateur.
					<br />
					Pas de sycnhronisation avec les autres appareils (même en étant connecté).
				</p>
				<p>
					Si vous choisissez Cloud (dispo dans la version 4.0), la mise à jour du portfolio se fera sur le
					serveur de l&apos;application.
					<br />
					<strong>Avantages:</strong> Vous n&apos;avez pas besoin de laisser votre machine allumée et que le
					logiciel tourne, tout se fera automatiquement.
					<br />
					Synchronisation entre tous les appareils connectés.
					<br />
					Sauvegarde distante des données.
					<br />
					<strong>Inconvénient:</strong> Vous devez fournir une clé API (en lecture seulement) pour chaque
					exchange que vous souhaitez utiliser.
				</p>
			</div>
			{currentOffer !== 'Invité' && (
				<>
					<Text preset={'h3'} text={'Wallets'} />
					{wallets.map((wallet, id) => (
						<PortfolioWallet
							preset={'default'}
							key={`wallet-${id}`}
							name={wallet.name}
							address={wallet.address}
							onDelete={(): Promise<void> => handleDeleteWallet(wallet)}
							tokens={[]}
							onSelectToken={(): void => {}}
						/>
					))}
					<PortfolioWallet preset={'add'} onClick={handleAddWallet} />

					<Text preset={'h3'} text={'Exchanges'} />
					{exchanges.map((exchange, id) => (
						<PortfolioExchange
							preset={'default'}
							key={`exchange-${id}`}
							name={exchange._exchangeData?.name || ''}
							data={exchange._exchangeData}
							onDelete={(): Promise<void> => handleDeleteExchange(exchange)}
							tokens={[]}
							onSelectToken={(): void => {}}
						/>
					))}
					<PortfolioExchange preset={'add'} onClick={handleAddExchange} />
				</>
			)}
			<Text preset={'h3'} text={'Custom tokens'} />
			<div className="flex flex-row gap-4 flex-wrap">
				{portfolioTokens.map((token, index) => (
					<PortfolioToken
						preset={'default'}
						key={`token-${index}`}
						name={token._tokenApiData.name || ''}
						logo={token._tokenApiData.logo || ''}
						onClick={(): Promise<void> => handleSelectToken(token)}
						onDelete={(): Promise<void> => handleDeleteCustomToken(token)}
					/>
				))}
				<PortfolioToken preset={'add'} onClick={handleAddToken} />
			</div>
			<div className="flex w-full items-center justify-center gap-4">
				<Button text={'Annuler'} preset={'cancel'} onPress={handleAnnuler} />
				<Button
					text={'Valider'}
					preset={'default'}
					disabled={
						(portfolioTokens.length === 0 && wallets.length === 0 && exchanges.length === 0) ||
						currentPortfolio?.name === '' ||
						isLoading
					}
					onPress={handleValider}
				/>
			</div>
		</div>
	)
}

export default PortfolioCreate
