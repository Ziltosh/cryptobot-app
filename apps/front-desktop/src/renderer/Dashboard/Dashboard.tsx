import { Text } from '@cryptobot/ui'
import React from 'react'

const Dashboard = (): JSX.Element => {
	document.title = 'Dashboard'

	React.useEffect(() => {
		//
	}, [])

	return (
		<>
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={'Dashboard'} />
				<Text preset={'breadcrumb'} text={`Cryptobot > Accueil`} />
			</div>
		</>
	)
}

export default Dashboard
