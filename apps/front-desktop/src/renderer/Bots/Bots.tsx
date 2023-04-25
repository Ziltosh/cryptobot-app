import { Text } from '@cryptobot/ui'
import { BoxMessage } from '@cryptobot/ui/src/Molecules/BoxMessage/BoxMessage'

const Bots = (): JSX.Element => {
	document.title = 'Stratégies'

	return (
		<>
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={'Bots et stratégies'} />
				<Text preset={'breadcrumb'} text={`Cryptobot > Bots et stratégies`} />
			</div>

			<BoxMessage title={'Fonctionnement'} defaultHide={false}>
				<Text
					text={`
				**Général**
				<br />
				Cette partie de l'application servira à mettre en place des bots de trading. Vous pourrez paramétrer des stratégies
				en quelques minutes en vous servant de tout un tas d'indicateur intégré à Cryptobot. Le tout sans aucune connaissance en développement. 
				Ces stratégies pourront tourner sur votre machine ou bien sur le serveur Cryptobot afin de ne pas louper de trade. 
				 
				`}
				/>
			</BoxMessage>

			<div className={'flex flex-row grow w-full items-center justify-center'}>
				<Text preset={'h1'} text={'Sera disponible dans la version 3.0'} />
			</div>
		</>
	)
}

export default Bots
