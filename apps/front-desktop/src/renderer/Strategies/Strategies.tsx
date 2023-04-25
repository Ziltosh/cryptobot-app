import { Text } from '@cryptobot/ui'

const Strategies = (): JSX.Element => {
	document.title = 'Stratégies'

	return (
		<div className={'flex flex-row justify-between'}>
			<Text preset={'h1'} text={'Stratégies'} />
			<Text preset={'breadcrumb'} text={`Cryptobot > Stratégies`} />
		</div>
	)
}

export default Strategies
