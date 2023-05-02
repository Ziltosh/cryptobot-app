import "../../index.css";
import { Select } from "../../Atoms/Select/Select";
import { Input } from "../../Atoms/Input/Input";
import { FaTrashAlt, MdCheck } from "react-icons/all";
import React from "react";
import { BlockchainDB, ExchangeDB } from "@cryptobot/shared/src/prisma-types/db-api/DB.types";
import { LogoItem } from "../../Atoms/LogoItem/LogoItem";
import { Button } from "../../Atoms/Button/Button";
import { Currency } from "../../Atoms/Currency/Currency";
import { PortfolioTokenTransactionsLocalDB } from "@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types";
import { update } from "blinkdb";
import { GroupOptionWithImage } from "@cryptobot/shared/src/ui/select/Option.types";
import { portfolioTokenTransactionTable } from "@cryptobot/shared/src/blink/Portfolio";
import { usePortfolioTokenTransactions } from "@cryptobot/shared/src/hooks/blink/portfolio";

type PresetProps = {
	default: {
		transactionId: string
		index: number
		originSelectOptions?: GroupOptionWithImage[]
		dataTransaction: PortfolioTokenTransactionsLocalDB
		onDelete?: (id: string) => void
	}

	edit: {
		transactionId: string
		index: number
		originSelectOptions?: GroupOptionWithImage[]
		fnGetPrice: () => Promise<void>
		onValidate?: () => void
		onDelete?: () => void
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

export const PortfolioTokenTransaction = <P extends Preset>(props: Props<P>) => {
	// const classesToApply = twMerge(classes[props.preset || 'default'])

	const [loadingAutoPrice, setLoadingAutoPrice] = React.useState<boolean>(false)
	const [isComplete, setIsComplete] = React.useState<boolean>(false)

	const { currentTokenTransaction } = usePortfolioTokenTransactions()

	React.useEffect(() => {
		console.log('useEffect transactionStore', currentTokenTransaction)
		if (
			currentTokenTransaction &&
			currentTokenTransaction.type &&
			currentTokenTransaction.quantite &&
			currentTokenTransaction.quantite >= 0 &&
			currentTokenTransaction.prix &&
			currentTokenTransaction.date &&
			(currentTokenTransaction?.exchange_id || currentTokenTransaction?.blockchain_id)
		) {
			setIsComplete(true)
		} else {
			setIsComplete(false)
		}
	}, [currentTokenTransaction])

	if (props.preset === 'edit') {
		const castProps = props as Props<'edit'>

		const getCoutTransaction = () => {
			if (currentTokenTransaction?.quantite && currentTokenTransaction?.prix) {
				return currentTokenTransaction?.quantite * currentTokenTransaction?.prix
			}
			return 0
		}

		const coutTransaction = getCoutTransaction()

		const handleGetPrice = async () => {
			setLoadingAutoPrice(true)
			await castProps.fnGetPrice()
			setLoadingAutoPrice(false)
		}

		return (
			<tr className={`align-top`}>
				<td className={'pt-3'}>{castProps.index}</td>
				<td>
					<Select
						options={[
							{ label: 'Achat', value: 'in', data: null },
							{ label: 'Vente', value: 'out', data: null },
						]}
						onChange={async (option) => {
							if (option?.value && currentTokenTransaction?.id)
								await update(portfolioTokenTransactionTable, {
									id: currentTokenTransaction?.id,
									type: option?.value as 'in' | 'out',
								})
						}}
						selected={currentTokenTransaction?.type || 'in'}
						preset={'default'}
					/>
				</td>
				<td>
					<Select
						options={castProps.originSelectOptions || []}
						onChange={async (option) => {
							console.log('option', option, castProps.transactionId)
							if (option?.type === 'blockchain') {
								const data = option.data as BlockchainDB
								if (currentTokenTransaction?.id) {
									await update(portfolioTokenTransactionTable, {
										id: currentTokenTransaction?.id,
										blockchain_id: data.id,
										_blockchainData: data,
										exchange_id: '',
										_exchangeData: undefined,
									})
								}
							} else if (option?.type === 'exchange') {
								const data = option.data as ExchangeDB
								if (currentTokenTransaction?.id) {
									await update(portfolioTokenTransactionTable, {
										id: currentTokenTransaction?.id,
										blockchain_id: '',
										_blockchainData: undefined,
										exchange_id: data.id,
										_exchangeData: data,
									})
								}
							}
						}}
						preset={'group-with-image'}
						selected={currentTokenTransaction?.exchange_id || currentTokenTransaction?.blockchain_id || ''}
					/>
				</td>
				<td>
					<Input
						type={'datetime-local'}
						name={'date'}
						value={new Date(currentTokenTransaction?.date || new Date().getTime())
							.toISOString()
							.slice(0, -8)}
						onChange={async (event) => {
							const value = event.target.value
							const newDate = new Date(Date.parse(value))
							if (newDate.toString() === 'Invalid Date') return
							if (currentTokenTransaction?.id)
								await update(portfolioTokenTransactionTable, {
									id: currentTokenTransaction.id,
									date: newDate.getTime(),
								})
						}}
						maximum={new Date().toISOString().slice(0, -8)}
					/>
				</td>
				<td>
					<Input
						type={'number'}
						name={'price'}
						currency={true}
						minimum={0}
						maximum={10}
						value={currentTokenTransaction?.prix.toString() || '0'}
						onValueChange={async (value) => {
							if (currentTokenTransaction?.id)
								await update(portfolioTokenTransactionTable, {
									id: currentTokenTransaction.id,
									prix: value,
								})
						}}
					/>
					<Button
						text={loadingAutoPrice ? 'En cours...' : 'Récupérer'}
						preset={'link-dark'}
						tooltip={'Récupérer le prix à la date renseignée.'}
						onPress={handleGetPrice}
						disabled={
							!currentTokenTransaction?.date ||
							loadingAutoPrice ||
							currentTokenTransaction?.date.toString() === 'Invalid Date' ||
							currentTokenTransaction?.date > new Date().getTime()
						}
					/>
				</td>
				<td>
					<Input
						type={'number'}
						name={'qty'}
						minimum={0}
						value={currentTokenTransaction?.quantite.toString() || '0'}
						onValueChange={async (value) => {
							if (currentTokenTransaction?.id)
								await update(portfolioTokenTransactionTable, {
									id: currentTokenTransaction.id,
									quantite: value,
								})
						}}
					/>
				</td>
				<td className={'pt-2'}>
					{Intl.NumberFormat('fr-FR', { currency: 'USD', style: 'currency' }).format(coutTransaction)}
				</td>
				<td className={'pt-2'}>
					{isComplete && (
						<MdCheck size={24} className={'text-green-500 cursor-pointer'} onClick={castProps.onValidate} />
					)}
				</td>
			</tr>
		)
	} else {
		const castProps = props as Props<'default'>

		const getCoutTransaction = () => {
			return castProps.dataTransaction.quantite * castProps.dataTransaction.prix
		}

		const coutTransaction = getCoutTransaction()

		return (
			<tr className={`align-middle ${castProps.dataTransaction?._isNew ? 'bg-amber-100' : ''}`}>
				<td>{castProps.index}</td>
				<td>{castProps.dataTransaction.type}</td>
				<td>
					{castProps.dataTransaction.blockchain_id && (
						<LogoItem
							data={castProps.dataTransaction._blockchainData as BlockchainDB}
							preset={'blockchain'}
							withText={true}
							name={castProps.dataTransaction._blockchainData?.name || ''}
						/>
					)}
					{castProps.dataTransaction.exchange_id && (
						<LogoItem
							data={castProps.dataTransaction._exchangeData as ExchangeDB}
							preset={'exchange'}
							withText={true}
							name={castProps.dataTransaction._exchangeData?.name || ''}
						/>
					)}
				</td>
				<td>
					{Intl.DateTimeFormat('fr-FR', { timeStyle: 'medium', dateStyle: 'short' }).format(
						new Date(castProps.dataTransaction.date)
					)}
				</td>
				<td>
					<Currency value={castProps.dataTransaction?.prix || 0} fractionDigits={4} preset={'default'} />
				</td>
				<td>{Intl.NumberFormat('fr-FR').format(castProps.dataTransaction.quantite)}</td>
				<td>
					<Currency value={coutTransaction} fractionDigits={4} preset={'default'} />
				</td>
				<td className={'flex flex-row items-center gap-2'}>
					<FaTrashAlt
						size={16}
						className={'text-red-500 cursor-pointer'}
						onClick={() => {
							if (castProps.onDelete) castProps.onDelete(castProps.dataTransaction.id)
						}}
					/>
				</td>
			</tr>
		)
	}
}
