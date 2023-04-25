import { Text } from '@cryptobot/ui'
import React from 'react'
import { OfferWithLimitsDB } from '@cryptobot/db-api'

const Tests = (): JSX.Element => {
	document.title = 'Tests'

	const [offers, setOffers] = React.useState<OfferWithLimitsDB[]>([])
	const [latestMigration, setLatestMigration] = React.useState<string>('')
	const [dbLocation, setDbLocation] = React.useState<string>('')

	React.useEffect(() => {
		;(async (): Promise<void> => {
			setOffers(await window.dbApi.getOffers({ service: 'portfolio' }))
			setLatestMigration(await window.localDbApi.getLastMigration())
			setDbLocation(await window.localDbApi.getDbLocation())
		})()
	}, [])

	return (
		<div className="flex flex-col">
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={'Tests'} />
				<Text preset={'breadcrumb'} text={`Cryptobot > Tests`} />
			</div>
			<Text preset={'h2'} text={'Accès DB locale'} />

			<Text preset={'default'} text={`Emplacement: ${dbLocation}`} />

			<Text preset={'default'} text={`Dernière migration: ${latestMigration}`} />

			<Text preset={'h2'} text={'Accès API (Liste des offres)'} />

			{offers.map((offer) => (
				<div key={offer.id}>
					<Text preset={'default'} text={offer.name} />
				</div>
			))}
		</div>
	)
}

export default Tests
