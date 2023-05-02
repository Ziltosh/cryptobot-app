import { useNavigate } from "react-router-dom";
import React from "react";
import { useUserStore } from "@cryptobot/shared/src/front-desktop/renderer/stores/UserStore";
import { Button, Text } from "@cryptobot/ui";

const Account = (): JSX.Element => {
	document.title = 'Dashboard'

	const navigate = useNavigate()

	const userStore = useUserStore()

	React.useEffect(() => {
		;(async (): Promise<void> => {
			if (userStore.userToken) {
				const user = await window.dbApi.me({ token: userStore.userToken?.token })
				userStore.setUser(user)
			}
		})()
	}, [])

	const handleDeconnexion = (): void => {
		userStore.setUser(null)
		userStore.setUserToken(null)
		navigate('/', { replace: true })
	}

	return (
		<>
			<div className={'flex flex-row justify-between'}>
				<Text preset={'h1'} text={'Mon compte'} />
				<Text preset={'breadcrumb'} text={`Cryptobot > Mon compte`} />
			</div>

			<div className="flex items-center justify-center">
				<Button preset={'cancel'} text={'Se déconnecter'} onPress={handleDeconnexion} />
			</div>
		</>
	)
}

export default Account
