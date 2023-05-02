import "../../index.css";
import { BlockchainDB } from "@cryptobot/shared/src/prisma-types/db-api/DB.types";
import { LogoItem } from "../../Atoms/LogoItem/LogoItem";
import { Currency } from "../../Atoms/Currency/Currency";
import {
	PortfolioWalletTransactionsLocalDB
} from "@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types";
import { GroupOptionWithImage } from "@cryptobot/shared/src/ui/select/Option.types";

type PresetProps = {
	default: {
		transactionId: string
		index: number
		originSelectOptions?: GroupOptionWithImage[]
		dataTransaction: PortfolioWalletTransactionsLocalDB
	}
}

type Preset = keyof PresetProps

type Props<P extends Preset> = PresetProps[P] & {
	preset: P
}

export const PortfolioWalletTransaction = <P extends Preset>(props: Props<P>) => {
	// const classesToApply = twMerge(classes[props.preset || 'default'])

	const castProps = props as Props<'default'>

	const getCoutTransaction = () => {
		return castProps.dataTransaction.quantite * castProps.dataTransaction.prix
	}

	const coutTransaction = getCoutTransaction()

	return (
		<tr className={`align-middle`}>
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
			<td>{castProps.dataTransaction.hash}</td>
		</tr>
	)
}
