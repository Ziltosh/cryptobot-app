import React from 'react'
import { PortfolioTokenTransaction, PortfolioTransactions as UIPortfolioTransactions, Text } from '@cryptobot/ui'
import { BlockchainDB, ExchangeDB } from '@cryptobot/db-api'
import { getImageUrl } from '@cryptobot/shared/src/helpers/imageUrl.fn'
import { GroupOptionWithImage, OptionWithImage } from '@cryptobot/shared/src/ui/select/Option.types'
import { PortfolioTokenTransactionsLocalDB } from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'
import { PortfolioWalletTransaction } from '@cryptobot/ui/src/Molecules/Portfolio/PortfolioWalletTransaction'
import { portfolioTokenTransactionTable } from '@cryptobot/shared/src/blink/Portfolio'
import { insert, remove, update } from 'blinkdb'
import { generateId } from '@cryptobot/shared/src/helpers/generateId.fn'
import {
	usePortfolioTokens,
	usePortfolioTokenTransactions,
	usePortfolioWalletTransactions,
} from '@cryptobot/shared/src/hooks/blink/portfolio'

type Props = {
	mode: 'custom' | 'wallet'
}

const PortfolioTransactions = (props: Props): JSX.Element => {
	document.title = 'PortfolioTransactions'

	const { tokenTransactions, currentTokenTransaction } = usePortfolioTokenTransactions()
	const { wtransactions } = usePortfolioWalletTransactions()
	const { currentToken } = usePortfolioTokens()

	const [blockchainSelectOptions, setBlockchainSelectOptions] = React.useState<GroupOptionWithImage[]>([])
	// const [currentPortfolio, setCurrentPortfolio] = React.useState<PortfolioLocalDB | null>(null)

	React.useEffect(() => {
		setBlockchainSelectOptions([])
		;(async (): Promise<void> => {
			await getBlockchainsAndExchanges()
		})()
	}, [currentToken])

	const getBlockchainsAndExchanges = async (): Promise<void> => {
		console.log('getBlockchainsAndExchanges', currentToken?.api_token_id)

		if (currentToken) {
			const blockchains = await window.dbApi.getTokenBlockchains({
				tokenId: currentToken.api_token_id,
			})

			console.log('getBlockchainsAndExchanges', blockchains)
			const blockchainsWithImage = blockchains.map((blockchain: BlockchainDB): OptionWithImage => {
				return {
					value: blockchain.id,
					label: blockchain.display_name,
					image: getImageUrl(blockchain.logo_downloaded, 'blockchains', blockchain.id, blockchain.logo || ''),
					data: blockchain,
					type: 'blockchain',
				}
			})

			const exchanges = await window.dbApi.getTokenExchanges({
				tokenId: currentToken.api_token_id,
			})
			const exchangesWithImage = exchanges.map((exchange: ExchangeDB): OptionWithImage => {
				return {
					value: exchange.id,
					label: exchange.display_name,
					image: getImageUrl(exchange.logo_downloaded, 'exchanges', exchange.id, exchange.logo || ''),
					data: exchange,
					type: 'exchange',
				}
			})

			const options = [
				{
					label: 'Blockchains',
					options: blockchainsWithImage,
				},
				{
					label: 'Exchanges',
					options: exchangesWithImage,
				},
			]
			setBlockchainSelectOptions(options)
		}
	}

	const getPrice = async (): Promise<void> => {
		if (
			(!currentToken?._tokenApiData?.coingecko_id && !currentToken?._tokenApiData?.zerion_id) ||
			!currentTokenTransaction
		) {
			return
		}

		const autoPrice = await window.dbApi.getMarketPrice({
			coingeckoZerionId: currentToken._tokenApiData.coingecko_id
				? currentToken._tokenApiData.coingecko_id
				: currentToken._tokenApiData.zerion_id!,
			currency: 'USD',
			atDate: new Date(currentTokenTransaction?.date ?? new Date().getTime()),
		})

		console.log('autoPrice', autoPrice)

		if (!autoPrice) {
			await update(portfolioTokenTransactionTable, { id: currentTokenTransaction.id, prix: 0 })
		} else {
			await update(portfolioTokenTransactionTable, { id: currentTokenTransaction.id, prix: autoPrice.price })
		}
	}

	const handleValidateTransaction = async (): Promise<void> => {
		console.log('handleValidateTransaction', currentTokenTransaction, currentToken)
		if (currentTokenTransaction && currentToken) {
			await update(portfolioTokenTransactionTable, {
				id: currentTokenTransaction.id,
				_isValidated: true,
				portfolio_token_id: currentToken.id,
				_isCurrent: false,
			})
			await insert(portfolioTokenTransactionTable, {
				portfolio_token_id: currentToken.id,
				_apiTokenId: currentToken._tokenApiData.id,
				id: generateId(10),
				date: new Date().getTime(),
				_isValidated: false,
				type: 'in',
				quantite: 0,
				exchange_id: null,
				_isCurrent: true,
				blockchain_id: null,
				fee_quantite: 0,
				prix: 0,
				updatedAt: new Date(),
			})
		}
	}

	const handleDeleteTransaction = async (transaction: PortfolioTokenTransactionsLocalDB): Promise<void> => {
		await remove(portfolioTokenTransactionTable, { id: transaction.id })
	}

	return (
		<div className="flex flex-col">
			{currentToken && props.mode === 'custom' && (
				<>
					<Text text={'Transactions perso'} preset={'h3'} />
					<UIPortfolioTransactions preset={'default'}>
						{tokenTransactions
							.sort((a, b) => (a.date > b.date ? -1 : 1))
							.filter(
								(transaction) =>
									transaction.portfolio_token_id === currentToken?.id && transaction._isValidated
							)
							.map((transaction, indexTransaction) => (
								<PortfolioTokenTransaction
									index={indexTransaction}
									originSelectOptions={blockchainSelectOptions}
									key={`transaction-${indexTransaction}`}
									preset={'default'}
									dataTransaction={transaction}
									transactionId={transaction.id}
									onDelete={(): Promise<void> => handleDeleteTransaction(transaction)}
								/>
							))}
						{currentTokenTransaction && (
							<PortfolioTokenTransaction
								index={tokenTransactions.length + 1}
								transactionId={currentTokenTransaction.id}
								originSelectOptions={blockchainSelectOptions}
								preset={'edit'}
								fnGetPrice={getPrice}
								onValidate={handleValidateTransaction}
							/>
						)}
					</UIPortfolioTransactions>
				</>
			)}
			{currentToken && props.mode === 'wallet' && (
				<>
					<Text text={'Transactions wallet'} preset={'h3'} />
					<UIPortfolioTransactions preset={'default'}>
						{wtransactions
							.filter((transaction) => transaction.portfolio_token_id === currentToken?.id)
							.filter((transaction) => transaction.quantite > 0)
							.sort((a, b) => (a.date > b.date ? -1 : 1))
							.map((transaction, indexTransaction) => (
								<PortfolioWalletTransaction
									index={indexTransaction}
									originSelectOptions={blockchainSelectOptions}
									key={`transfer-${indexTransaction}`}
									preset={'default'}
									dataTransaction={transaction}
									transactionId={transaction.id}
								/>
							))}
					</UIPortfolioTransactions>
				</>
			)}
		</div>
	)
}

export default PortfolioTransactions
