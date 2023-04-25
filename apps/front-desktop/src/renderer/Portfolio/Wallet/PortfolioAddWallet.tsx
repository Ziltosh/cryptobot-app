import { Button, Input, Label, LogoItem, Text } from '@cryptobot/ui'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { BoxMessage } from '@cryptobot/ui/src/Molecules/BoxMessage/BoxMessage'
import { useMiscStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/MiscStore'
import { insert } from 'blinkdb'
import { generateId } from '@cryptobot/shared/src/helpers/generateId.fn'
import { portfolioWalletTable } from '@cryptobot/shared/src/blink/Portfolio'
import { usePortfolios } from '@cryptobot/shared/src/hooks/blink/portfolio'
import { BlockchainDB } from '@cryptobot/shared/src/prisma-types/db-api/DB.types'

const PortfolioAddWallet = (): JSX.Element => {
	document.title = 'Ajout wallet'

	const navigate = useNavigate()

	const miscStore = useMiscStore()

	const { currentPortfolio } = usePortfolios()

	const [address, setAddress] = React.useState<string>('')
	const [isValidAddress, setIsValidAddress] = React.useState<boolean>(false)
	const [name, setName] = React.useState<string>('')
	const [blockchainsSupport, setBlockchainsSupport] = React.useState<BlockchainDB[]>([])

	React.useEffect(() => {
		window.dbApi.getCompatibleBlockchains({ type: 'evm' }).then((blockchains) => {
			setBlockchainsSupport(blockchains)
		})
	}, [])

	React.useEffect(() => {
		const adresseEthereumRegex = /^(0x)?[0-9a-fA-F]{40}$/
		const adresseSolanaRegex = /^([A-Za-z0-9+/]{44}|[A-Za-z0-9+/]{43})$/

		if (adresseEthereumRegex.test(address) || adresseSolanaRegex.test(address)) {
			setIsValidAddress(true)
		} else {
			setIsValidAddress(false)
		}
	}, [address])

	const handleAnnuler = (): void => {
		navigate(miscStore.returnToPortfolio, { replace: true })
	}

	const handleAddWallet = async (): Promise<void> => {
		if (currentPortfolio)
			await insert(portfolioWalletTable, {
				address: address,
				name: name,
				id: generateId(10),
				address_type: 'evm',
				portfolio_id: currentPortfolio.id,
				updatedAt: new Date(),
			})
		navigate(miscStore.returnToPortfolio, { replace: true })
	}

	return (
		<>
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={"Ajout d'un wallet"} />
				<Text preset={'breadcrumb'} text={`Cryptobot > ${currentPortfolio?.name} > Ajout d'un wallet`} />
			</div>

			<div className={'flex flex-col'}>
				<Text preset={'h2'} text={'Limites'} />
				<Text preset={'default'} text={`Vous pouvez encore ajouter <strong>TODO</strong> wallets.`} />
				<Text text={'Paramétrage'} preset={'h2'} />
				<BoxMessage preset={'default'} titlePreset={'h3'} title={'Informations'} className={'mb-4'}>
					Si vous avez un vieux wallet avec beaucoup de transactions, la première synchronisation peut prendre
					plusieurs dizaines de minutes. <br />
					<br />
					Blockchains supportées :
					{blockchainsSupport.map((blockchain, index) => (
						<LogoItem
							key={`bc-${index}`}
							data={blockchain}
							preset={'blockchain'}
							name={blockchain.name}
							withText
						/>
					))}
					D&apos;autres seront rajoutées dans de prochaines mises à jour.
				</BoxMessage>
				<div className="flex flex-row gap-4 items-center mb-4">
					<Label className={'w-40'} text={'Nom'} for={'nom'} />
					<Input type={'text'} name={'nom'} width={300} onChange={(e): void => setName(e.target.value)} />
				</div>
				<div className="flex flex-row gap-4 items-center">
					<Label className={'w-40'} text={'Adresse'} for={'address'} />
					<Input
						type={'text'}
						name={'address'}
						width={300}
						onChange={(e): void => setAddress(e.target.value)}
					/>
					{!isValidAddress && address.length > 0 && (
						<div className="p-2 bg-red-100 text-white rounded-md">
							<Text text={'Adresse invalide'} className={'text-sm text-red-500'} />
						</div>
					)}
				</div>

				<div className="flex flex-row gap-4 grow items-center justify-center">
					<Button text={'Revenir'} preset={'cancel'} onPress={handleAnnuler} />
					<Button
						text={'Ajouter'}
						onPress={handleAddWallet}
						disabled={!isValidAddress || address.length === 0 || name.length === 0}
					/>
				</div>
			</div>
		</>
	)
}

export default PortfolioAddWallet
