import { Button, Input, Label, PortfolioExchange, PortfolioToken, PortfolioWallet, Text } from '@cryptobot/ui'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/UserStore'
import { useOfferStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/OfferStore'
import {
	PortfolioExchangesLocalDB,
	PortfolioTokensLocalDB,
	PortfolioWalletsLocalDB,
} from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'
import { insert, remove, removeWhere, update } from 'blinkdb'
import {
	portfolioExchangeBalanceTable,
	portfolioExchangeTable,
	portfolioTable,
	portfolioTokenTable,
	portfolioTokenTransactionTable,
	portfolioWalletTable,
	portfolioWalletTransactionTable,
} from '@cryptobot/shared/src/blink/Portfolio'
import {
	usePortfolioExchangeBalances,
	usePortfolioExchanges,
	usePortfolios,
	usePortfolioTokens,
	usePortfolioTokenTransactions,
	usePortfolioWallets,
	usePortfolioWalletTransactions,
} from '@cryptobot/shared/src/hooks/blink/portfolio'
import { generateId } from '@cryptobot/shared/src/helpers/generateId.fn'

const PortfolioEdit = (): JSX.Element => {
	document.title = 'Edition portfolio'

	const navigate = useNavigate()

	// const portfolioStore = usePortfolioStore()
	// const currentPortfolio = usePortfolioStore((state) => state.portfolios_current)
	const userStore = useUserStore()
	const offerStore = useOfferStore()
	// const transactionStore = useTransactionStore()

	const { currentPortfolio } = usePortfolios()
	const { portfolioTokens } = usePortfolioTokens()
	const { wtransactions } = usePortfolioWalletTransactions()
	const { etransactions } = usePortfolioExchangeBalances()
	const { wallets } = usePortfolioWallets()
	const { exchanges } = usePortfolioExchanges()
	const { tokenTransactions } = usePortfolioTokenTransactions()

	console.log(exchanges)

	const [currentOffer, setCurrentOffer] = React.useState<string | null>('Invité')
	const [isLoading, setIsLoading] = React.useState<boolean>(false)

	React.useEffect(() => {
		if (userStore.user) {
			const offer = offerStore.offers.find((offer) => offer.id === userStore.user?.offer_id)
			if (offer) setCurrentOffer(offer.name)
		}
	}, [userStore.user, offerStore.offers])

	const handlePortfolioNameChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		if (currentPortfolio) await update(portfolioTable, { id: currentPortfolio.id, name: e.target.value })
	}

	// TODO: Change emplacement
	// const handleEmplacementChange = (option: OptionBase | null): void => {
	// if (option) portfolioStore.setEmplacement(option.value)
	// }

	const handleValider = async (): Promise<void> => {
		setIsLoading(true)
		if (currentPortfolio) {
			console.log('portfolioTokens', portfolioTokens)

			await window.localDbApi.editPortfolio({
				portfolioData: currentPortfolio,
				tokenTransactionsData: tokenTransactions.filter((transaction) => transaction._isValidated), // Pour enlever la ou les transactions temporaires
				portfolioTokensData: [...portfolioTokens],
				walletsData: wallets,
				exchangesData: exchanges,
			})
		}
		setIsLoading(false)
		navigate('/portfolio/show', { replace: true })
	}

	const handleAnnuler = (): void => {
		navigate('/portfolio/show', { replace: true })
	}

	const handleAddToken = (): void => {
		navigate('/portfolio/add-token', { replace: true })
	}

	const handleDeleteCustomToken = async (token: PortfolioTokensLocalDB): Promise<void> => {
		// portfolioStore.ctransaction_deleteByTokenId(token.id)
		// portfolioStore.ptokens_delete(token)
		await removeWhere(portfolioTokenTransactionTable, {
			where: {
				portfolio_token_id: token.id,
			},
		})

		await removeWhere(portfolioTokenTable, {
			where: {
				id: token.id,
			},
		})
	}

	const handleDeleteWallet = async (wallet: PortfolioWalletsLocalDB): Promise<void> => {
		// portfolioStore.wallets_delete(wallet)
		await remove(portfolioWalletTable, { id: wallet.id })
		await removeWhere(portfolioWalletTransactionTable, {
			where: {
				portfolio_wallet_id: wallet.id,
			},
		})
	}

	const handleDeleteExchange = async (exchange: PortfolioExchangesLocalDB): Promise<void> => {
		// portfolioStore.wallets_delete(wallet)
		await remove(portfolioExchangeTable, { id: exchange.id })
		await removeWhere(portfolioExchangeBalanceTable, {
			where: {
				portfolio_exchange_id: exchange.id,
			},
		})
	}

	const handleSelectToken = async (token: PortfolioTokensLocalDB, from = 'custom'): Promise<void> => {
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
		if (from === 'custom') {
			navigate('/portfolio/edit-token', { replace: true })
		} else {
			navigate('/portfolio/view-token', { replace: true })
		}
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
				<Text preset={'h1'} text={`Modification du portfolio : ${currentPortfolio?.name}`} />
				<Text preset={'breadcrumb'} text={`Cryptobot > Portfolios > Modification`} />
			</div>

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
				<Text text={currentPortfolio?._emplacement || 'local'} preset={'default'} />
			</div>
			{currentOffer !== 'Invité' && (
				<>
					<Text preset={'h3'} text={'Wallets'} />
					{wallets.map((wallet, id) => (
						<PortfolioWallet
							preset={'default'}
							key={`wallet-${id}`}
							name={wallet.name}
							tokens={portfolioTokens
								.filter((pt) =>
									wtransactions.find(
										(wt) => wt.portfolio_wallet_id === wallet.id && wt.portfolio_token_id === pt.id
									)
								)
								.filter((pt) => pt._tokenApiData.coingecko_data.id)
								.sort((a, b) => a._tokenApiData.name.localeCompare(b._tokenApiData.name))}
							onSelectToken={(token): Promise<void> => handleSelectToken(token, 'wallet')}
							address={wallet.address}
							onDelete={(): Promise<void> => handleDeleteWallet(wallet)}
						/>
					))}
					<PortfolioWallet preset={'add'} onClick={handleAddWallet} />
					<Text preset={'h3'} text={'Exchanges'} />
					{exchanges.map((exchange, id) => (
						<PortfolioExchange
							preset={'default'}
							key={`exchange-${id}`}
							name={exchange.nom}
							tokens={portfolioTokens
								.filter((pt) =>
									etransactions.find(
										(et) =>
											et.portfolio_exchange_id === exchange.id && et.portfolio_token_id === pt.id
									)
								)
								.filter((pt) => pt._tokenApiData.coingecko_data.id)
								.sort((a, b) => a._tokenApiData.name.localeCompare(b._tokenApiData.name))}
							onSelectToken={(token): Promise<void> => handleSelectToken(token, 'wallet')}
							onDelete={(): Promise<void> => handleDeleteExchange(exchange)}
							data={exchange._exchangeData}
						/>
					))}
					<PortfolioExchange preset={'add'} onClick={handleAddExchange} />
				</>
			)}
			<Text preset={'h3'} text={'Custom tokens'} />
			<div className="flex flex-row gap-4 flex-wrap">
				{portfolioTokens
					.filter((pt) => tokenTransactions.find((ct) => ct.portfolio_token_id === pt.id && ct._isValidated))
					.map((token, index) => {
						return (
							<PortfolioToken
								preset={'default'}
								key={`token-${index}`}
								name={token._tokenApiData?.name || ''}
								logo={token._tokenApiData?.logo || ''}
								onClick={(): Promise<void> => handleSelectToken(token, 'custom')}
								onDelete={(): Promise<void> => handleDeleteCustomToken(token)}
							/>
						)
					})}
				<PortfolioToken preset={'add'} onClick={handleAddToken} />
			</div>
			<div className="flex w-full items-center justify-center gap-4">
				<Button text={'Annuler'} preset={'cancel'} onPress={handleAnnuler} />
				<Button text={'Valider'} preset={'default'} disabled={isLoading} onPress={handleValider} />
			</div>
		</div>
	)
}

export default PortfolioEdit
