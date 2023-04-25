import { Text } from '@cryptobot/ui'
import { BoxMessage } from '@cryptobot/ui/src/Molecules/BoxMessage/BoxMessage'

const DCA = (): JSX.Element => {
	document.title = 'DCA'

	return (
		<>
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={'DCA'} />
				<Text preset={'breadcrumb'} text={`Cryptobot > DCA`} />
			</div>

			<BoxMessage title={'Fonctionnement'} defaultHide={false}>
				<Text
					text={`
				**Général**
				<br/>L'application achètera (au marché), à un intervalle défini, une certaine quantité de crypto monnaie.
				Ensuite, cette cryptomonnaie sera transférée via l'API de l'exchange, sur un wallet défini par l'utilisateur.
				Cela permet de laisser un minimum de cryptomonnaie sur l'exchange, et de se prémunir des risques de hack ou 
				faillites tout en profitant de tout les tokens dispos sur les différents exchanges.
				<br/><br/>**Étape 1**
				<br/>Vous devrez avoir un compte sur un exchange suporté par Cryptobot et sur lequel il y a le token que vous souhaitez DCA et y mettre du stablecoin.
				<br/><br/>**Étape 2**
				<br />Vous devrez renseigner une clé API avec les droits de **trading** et de **withdrawal**. De préférence, créez une clé dédiée
				 à la fonction DCA de Cryptobot.
				 <br />Le mode DCA ne tourne qu'en local sur votre machine, aucune clé API n'est envoyée sur le serveur de Cryptobot.
				 <br />Le logiciel devra donc être en train de tourner sur votre machine afin d'effectuer le DCA.
				<br /><br/>**Étape 3**
				<br />Paramétrez votre DCA, et lancez le. 
				`}
				/>
			</BoxMessage>

			<div className={'flex w-full grow items-center justify-center'}>
				<Text preset={'h1'} text={'Sera disponible dans la version 2.0'} />
			</div>
		</>
	)
}

export default DCA
