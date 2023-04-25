import { Button, Text } from '@cryptobot/ui'
import PortfolioTransactions from '../PortfolioTransactions'
import { useNavigate } from 'react-router-dom'
import { useMiscStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/MiscStore'
import {
	PortfolioLocalDB,
	PortfolioTokensLocalDB,
} from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'
import React from 'react'
import { first, update } from 'blinkdb'
import { portfolioTable, portfolioTokenTable } from '@cryptobot/shared/src/blink/Portfolio'

const PortfolioAddToken = (): JSX.Element => {
	document.title = "Vue d'un token"

	const navigate = useNavigate()
	const miscStore = useMiscStore()

	const [currentToken, setCurrentToken] = React.useState<PortfolioTokensLocalDB | null>(null)
	const [currentPortfolio, setCurrentPortfolio] = React.useState<PortfolioLocalDB | null>(null)

	React.useEffect(() => {
		first(portfolioTokenTable, {
			where: {
				_isCurrent: true,
			},
		}).then((token) => {
			setCurrentToken(token)
		})

		first(portfolioTable, {
			where: {
				_isCurrent: true,
			},
		}).then((portfolio) => {
			setCurrentPortfolio(portfolio)
		})
	}, [])

	const handleAnnuler = async (): Promise<void> => {
		// portfolioStore.ptokens_setCurrentIndex(-1)
		if (!currentToken) return
		await update(portfolioTokenTable, { id: currentToken.id, _isCurrent: false })
		navigate(miscStore.returnToPortfolio, { replace: true })
	}

	return (
		<div className="flex flex-col">
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={`Modification du token : ${currentToken?._tokenApiData?.name}`} />
				<Text
					preset={'breadcrumb'}
					text={`Cryptobot > Portfolios > ${currentPortfolio?.name} > Vue d'un token`}
				/>
			</div>
			<PortfolioTransactions mode={'wallet'} />

			<div className="flex w-full items-center justify-center gap-4 mt-8">
				<Button text={'Revenir'} preset={'cancel'} onPress={handleAnnuler} />
			</div>
		</div>
	)
}

export default PortfolioAddToken
