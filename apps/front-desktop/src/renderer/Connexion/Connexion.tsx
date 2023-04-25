import { Button, Input, Label, Text } from '@cryptobot/ui'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { useUserStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/UserStore'

const Connexion = (): JSX.Element => {
	document.title = 'Login'

	const navigate = useNavigate()

	const userStore = useUserStore()

	const [login, setLogin] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [error, setError] = React.useState('')

	const handleClickCreerCompte = (): void => {
		navigate('/inscription', { replace: true })
	}

	const handleConnexion = async (): Promise<void> => {
		const userToken = await window.dbApi.login({ login: login, password: password })
		console.log(userToken)
		if (userToken.user) {
			userStore.setUser(userToken.user)
			userStore.setUserToken(userToken.token)
			navigate('/', { replace: true })
		} else {
			setError("Erreur d'authentification.")
		}
	}

	return (
		<>
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={'Connexion'} />
				<Text preset={'breadcrumb'} text={`Cryptobot > Connexion`} />
			</div>
			<div className="flex grow gap-3 items-center">
				<div className="flex grow flex-col items-center gap-1">
					{error && <div className="text-red-500 bg-red-100 rounded-md p-3 w-1/2 text-center">{error}</div>}
					<Label for={'pseudo'} text={'Pseudo'} />
					<Input type={'text'} name={'pseudo'} onChange={(e): void => setLogin(e.target.value)} />
					<Label for={'password'} text={'Mot de passe'} />
					<Input type={'password'} name={'password'} onChange={(e): void => setPassword(e.target.value)} />
					<Button text={'Se connecter'} onPress={handleConnexion} />
					<Button text={'Créer un compte'} preset={'link-light'} onPress={handleClickCreerCompte} />
				</div>
			</div>
		</>
	)
}

export default Connexion
