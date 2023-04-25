import { Button, Input, Label, LogoItem, Select, Text } from '@cryptobot/ui'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { BoxMessage } from '@cryptobot/ui/src/Molecules/BoxMessage/BoxMessage'
import { useMiscStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/MiscStore'
import { usePortfolios } from '@cryptobot/shared/src/hooks/blink/portfolio'
import { ExchangeDB } from '@cryptobot/shared/src/prisma-types/db-api/DB.types'
import { GroupOptionWithImage, OptionWithImage } from '@cryptobot/shared/src/ui/select/Option.types'
import { getImageUrl } from '@cryptobot/shared/src/helpers/imageUrl.fn'
import { insert } from 'blinkdb'
import { portfolioExchangeTable } from '@cryptobot/shared/src/blink/Portfolio'
import { generateId } from '@cryptobot/shared/src/helpers/generateId.fn'

const PortfolioAddExchange = (): JSX.Element => {
	document.title = 'Ajout exchange'

	const navigate = useNavigate()

	const miscStore = useMiscStore()

	const { currentPortfolio } = usePortfolios()

	const [exchangesSupport, setExchangesSupport] = React.useState<ExchangeDB[]>([])
	const [exchangeSelectOptions, setExchangeSelectOptions] = React.useState<GroupOptionWithImage[]>([])
	const [currentExchangeSelected, setCurrentExchangeSelected] = React.useState<OptionWithImage | null>(null)
	const [publicKey, setPublicKey] = React.useState<string>('')
	const [privateKey, setPrivateKey] = React.useState<string>('')
	const [password, setPassword] = React.useState<string>('')
	const [nom, setNom] = React.useState<string>('')

	React.useEffect(() => {
		window.dbApi.getExchanges({ service: 'portfolio', isDefi: 0 }).then((exchanges) => {
			setExchangesSupport(exchanges)

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
					label: 'Exchanges',
					options: exchangesWithImage,
				},
			]
			setExchangeSelectOptions(options)
		})
	}, [])

	const handleAnnuler = (): void => {
		navigate(miscStore.returnToPortfolio, { replace: true })
	}

	const handleAddExchange = async (): Promise<void> => {
		console.log('handleAddExchange', currentPortfolio, currentExchangeSelected)
		if (currentPortfolio && currentExchangeSelected) {
			console.log({
				id: generateId(10),
				nom: nom,
				portfolio_id: currentPortfolio.id,
				exchange_id: (currentExchangeSelected.data as ExchangeDB).id,
				_exchangeData: currentExchangeSelected.data as ExchangeDB,
				api_data: JSON.stringify({
					public: publicKey,
					private: privateKey,
					password: password,
				}),
				updatedAt: new Date(),
			})
			await insert(portfolioExchangeTable, {
				id: generateId(10),
				nom: nom,
				portfolio_id: currentPortfolio.id,
				exchange_id: (currentExchangeSelected.data as ExchangeDB).id,
				_exchangeData: currentExchangeSelected.data as ExchangeDB,
				api_data: JSON.stringify({
					public: publicKey,
					private: privateKey,
					password: password,
				}),
				updatedAt: new Date(),
			})
		}
		navigate(miscStore.returnToPortfolio, { replace: true })
	}

	const handleSelectExchange = (option: OptionWithImage | null): void => {
		setCurrentExchangeSelected(option)
	}

	return (
		<>
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={"Ajout d'un exchange"} />
				<Text preset={'breadcrumb'} text={`Cryptobot > ${currentPortfolio?.name} > Ajout d'un exchange`} />
			</div>

			<div className={'flex flex-col'}>
				<Text text={'Paramétrage'} preset={'h2'} />
				<BoxMessage preset={'default'} titlePreset={'h3'} title={'Informations'} className={'mb-4'}>
					Exchanges supportés :
					{exchangesSupport.map((exchange, index) => (
						<LogoItem
							key={`bc-${index}`}
							data={exchange}
							preset={'exchange'}
							name={exchange.name}
							withText
						/>
					))}
					D&apos;autres seront rajoutées dans de prochaines mises à jour.
					<br /> <br />
					Pour le moment, seules les balances actuelles sont récupérées, ce qui ne permet pas de suivre les
					performances depuis le début mais seulement depuis la création du portfolio. La prise en compte de
					l&apos;historique des transactions est prévue pour les prochaines mises à jour.
				</BoxMessage>

				<div className="flex flex-row gap-4 items-center mb-4">
					<Label className={'w-60'} text={"Choix de l'exchange :"} for={'exchange'} />
					<Select
						options={exchangeSelectOptions}
						onChange={handleSelectExchange}
						preset={'group-with-image'}
					/>
				</div>

				<Text text={"Ce nom ne sert que dans l'application pour identifier le compte."} />
				<div className="flex flex-row gap-4 items-center mb-4">
					<Label className={'w-60'} text={'Nom du compte :'} for={'nom'} />
					<Input
						type={'text'}
						name={'nom'}
						width={250}
						value={nom}
						onChange={(e): void => setNom(e.target.value)}
					/>
				</div>

				<div className="flex flex-row gap-4 items-center mb-4">
					<Label className={'w-60'} text={'Clé publique :'} for={'public'} />
					<Input
						type={'text'}
						name={'public'}
						width={250}
						value={publicKey}
						onChange={(e): void => setPublicKey(e.target.value)}
					/>
				</div>

				<div className="flex flex-row gap-4 items-center mb-4">
					<Label className={'w-60'} text={'Clé privée :'} for={'privee'} />
					<Input
						type={'text'}
						name={'privee'}
						width={250}
						value={privateKey}
						onChange={(e): void => setPrivateKey(e.target.value)}
					/>
				</div>

				<Text
					text={
						'Certains exchanges demandent une information supplémentaire en plus des clés publique et privée.'
					}
				/>
				<div className="flex flex-row gap-4 items-center mb-4">
					<Label className={'w-60'} text={'Mot de passe / Phrase secrète (optionnel) :'} for={'password'} />
					<Input
						type={'text'}
						name={'password'}
						width={250}
						value={password}
						onChange={(e): void => setPassword(e.target.value)}
					/>
				</div>

				<div className="flex flex-row gap-4 grow items-center justify-center">
					<Button text={'Revenir'} preset={'cancel'} onPress={handleAnnuler} />
					<Button
						text={'Ajouter'}
						onPress={handleAddExchange}
						disabled={publicKey === '' || privateKey === '' || !currentExchangeSelected || nom === ''}
					/>
				</div>
			</div>
		</>
	)
}

export default PortfolioAddExchange
