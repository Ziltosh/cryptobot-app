import { Button, Input, Label, Text } from '@cryptobot/ui'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Inscription = (): JSX.Element => {
	document.title = 'Login'

	const navigate = useNavigate()

	const [login, setLogin] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [confirmPassword, setConfirmPassword] = React.useState('')
	const [isPasswordMatch, setIsPasswordMatch] = React.useState(false)
	const [error, setError] = React.useState('')

	React.useEffect(() => {
		if (password !== confirmPassword) {
			setIsPasswordMatch(false)
		} else {
			setIsPasswordMatch(true)
		}
	}, [password, confirmPassword])

	const handleInscription = async (): Promise<void> => {
		const user = await window.dbApi.register({ login: login, password: password })
		if (user) {
			navigate('/login', { replace: true })
		} else {
			setError("Ce pseudo n'est pas disponible.")
		}
	}

	return (
		<>
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={'Se connecter'} />
				<Text preset={'breadcrumb'} text={`Cryptobot > Se connecter`} />
			</div>
			<div className="flex grow gap-3 items-center">
				<div className="flex grow flex-col items-center gap-1">
					{error && <div className="text-red-500 bg-red-100 rounded-md p-3 w-1/2 text-center">{error}</div>}
					<Label for={'pseudo'} text={'Pseudo'} />
					<Input type={'text'} name={'pseudo'} onChange={(e): void => setLogin(e.target.value)} />
					<Label for={'password'} text={'Mot de passe'} />
					<Input
						minimum={8}
						type={'password'}
						name={'password'}
						onChange={(e): void => setPassword(e.target.value)}
					/>
					{password.length > 0 && password.length < 8 && (
						<div className="p-2 text-slate-500 bg-slate-100 rounded-md">
							Le mot de passe doit contenir au moins 8 caractères.
						</div>
					)}
					<Label for={'confirm_password'} text={'Mot de passe (confirmation)'} />
					<Input
						type={'password'}
						name={'confirm_password'}
						onChange={(e): void => setConfirmPassword(e.target.value)}
					/>
					{password !== confirmPassword && (
						<div className="p-2 text-slate-500 bg-slate-100 rounded-md">
							Les mots de passe ne correspondent pas.
						</div>
					)}
					<Button
						text={"S'inscrire"}
						disabled={password === '' || !isPasswordMatch}
						onPress={handleInscription}
					/>
				</div>
			</div>
		</>
	)
}

export default Inscription
