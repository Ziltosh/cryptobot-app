import { Button, Text } from '@cryptobot/ui'
import PortfolioTransactions from '../PortfolioTransactions'
import { useNavigate } from 'react-router-dom'
import { useMiscStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/MiscStore'
import { update } from 'blinkdb'
import { portfolioTokenTable } from '@cryptobot/shared/src/blink/Portfolio'
import { usePortfolios, usePortfolioTokens } from '@cryptobot/shared/src/hooks/blink/portfolio'

const PortfolioEditToken = (): JSX.Element => {
	document.title = 'PortfolioEditToken'

	const navigate = useNavigate()

	const miscStore = useMiscStore()

	const { currentPortfolio } = usePortfolios()
	const { currentToken } = usePortfolioTokens()

	const handleValider = async (): Promise<void> => {
		if (currentToken)
			await update(portfolioTokenTable, {
				id: currentToken.id,
				_isCurrent: false,
			})
		navigate(miscStore.returnToPortfolio, { replace: true })
	}

	// const handleAnnuler = (): void => {
	// 	portfolioStore.ptokens_setCurrentIndex(-1)
	// 	portfolioStore.ptokens_setSelectedToken(null)
	// 	navigate(miscStore.returnToPortfolio, { replace: true })
	// }

	return (
		<div className="flex flex-col">
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={`Modification du token : ${currentToken?._tokenApiData?.name}`} />
				<Text
					preset={'breadcrumb'}
					text={`Cryptobot > Portfolios > ${currentPortfolio?.name} > Modification d'un token`}
				/>
			</div>
			<PortfolioTransactions mode={'custom'} />

			<div className="flex w-full items-center justify-center gap-4 mt-8">
				{/*<Button text={'Annuler'} preset={'cancel'} onPress={handleAnnuler} />*/}
				<Button text={'Valider'} preset={'default'} disabled={false} onPress={handleValider} />
			</div>
		</div>
	)
}

export default PortfolioEditToken
