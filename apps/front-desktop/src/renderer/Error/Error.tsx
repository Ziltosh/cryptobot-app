import { Text } from '@cryptobot/ui'
import { Link, useRouteError } from 'react-router-dom'

const DCA = (): JSX.Element => {
	document.title = 'Erreur'

	const error: any = useRouteError()

	return (
		<>
			<div className="p-4">
				<div className={'flex flex-row justify-between'}>
					<Text preset={'h1'} text={'Erreur'} />
					<Text preset={'breadcrumb'} text={`Cryptobot > Erreur`} />
				</div>
				<div className="h-screen ">
					<p className="w-full">
						Erreur !
						<br />
						<i>{error.statusText || error.message}</i>
						<br />
						<br />
						<pre className="break-all whitespace-pre-line">{error.stack}</pre>
					</p>

					<Link className={'text-amber-500'} to={'/'}>
						Retour à l&apos;accueil
					</Link>
				</div>
			</div>
		</>
	)
}

export default DCA
