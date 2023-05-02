import React from "react";
import { Button, Select, Text } from "@cryptobot/ui";
import { TokenDB } from "@cryptobot/shared/src/prisma-types/db-api/DB.types";
import PortfolioTransactions from "../PortfolioTransactions";
import { getImageUrl } from "@cryptobot/shared/src/helpers/imageUrl.fn";
import { useNavigate } from "react-router-dom";
import { OptionWithImage } from "@cryptobot/shared/src/ui/select/Option.types";
import { useMiscStore } from "@cryptobot/shared/src/front-desktop/renderer/stores/MiscStore";
import { generateId } from "@cryptobot/shared/src/helpers/generateId.fn";
import { insert, remove, removeWhere, update } from "blinkdb";
import { portfolioTokenTable, portfolioTokenTransactionTable } from "@cryptobot/shared/src/blink/Portfolio";
import {
	usePortfolios,
	usePortfolioTokens,
	usePortfolioTokenTransactions
} from "@cryptobot/shared/src/hooks/blink/portfolio";
import { Modal } from "@cryptobot/ui/src/Molecules/Modal/Modal";

const PortfolioAddToken = (): JSX.Element => {
	document.title = 'PortfolioAddToken'

	const navigate = useNavigate()

	const miscStore = useMiscStore()

	const { currentPortfolio } = usePortfolios()
	const { portfolioTokens: ptokens, currentToken } = usePortfolioTokens()
	const { tokenTransactions } = usePortfolioTokenTransactions()

	const [tokensSelect, setTokensSelect] = React.useState<OptionWithImage[]>([])
	const [currentLetter, setCurrentLetter] = React.useState<string>('A')
	const [isModalNewTokenOpen, setIsModalNewTokenOpen] = React.useState<boolean>(false)

	React.useEffect(() => {
		;(async (): Promise<void> => {
			const tokens = await window.dbApi.getTokens({ letter: currentLetter })
			const tokensWithImage = tokens.map((token: TokenDB): OptionWithImage => {
				return {
					value: token.id,
					label: `${token.name} (${token.symbol.toUpperCase()})`,
					image: getImageUrl(token.logo_downloaded, 'tokens', token.id, token.logo),
					data: token,
					type: 'token',
					disabled: !!ptokens.find((pt) => pt._tokenApiData.id === token.id),
				}
			})
			setTokensSelect(tokensWithImage)
		})()
	}, [currentLetter])

	const handleChangeToken = async (token: OptionWithImage | null): Promise<void> => {
		if (currentToken) {
			await removeWhere(portfolioTokenTransactionTable, {
				where: {
					portfolio_token_id: currentToken.id,
				},
			})
			await remove(portfolioTokenTable, { id: currentToken.id })
		}

		if (token && currentPortfolio) {
			const newTokenId = await insert(portfolioTokenTable, {
				id: generateId(10),
				portfolio_id: currentPortfolio.id,
				_isCurrent: true,
				api_token_id: token.data.id,
				_tokenApiData: token.data as TokenDB,
				updatedAt: new Date(),
			})
			await insert(portfolioTokenTransactionTable, {
				portfolio_token_id: newTokenId,
				_apiTokenId: token.data.id,
				id: generateId(10),
				date: new Date().getTime(),
				_isValidated: false,
				type: 'in',
				quantite: 1,
				exchange_id: null,
				_isCurrent: true,
				blockchain_id: null,
				fee_quantite: 0,
				prix: 0,
				updatedAt: new Date(),
			})
		}
	}

	const handleValiderToken = async (): Promise<void> => {
		if (currentToken) await update(portfolioTokenTable, { id: currentToken.id, _isCurrent: false })

		navigate(miscStore.returnToPortfolio, { replace: true })
	}

	const handleNewToken = (): void => {
		setIsModalNewTokenOpen(true)
	}

	const handleAnnuler = (): void => {
		navigate(miscStore.returnToPortfolio, { replace: true })
	}

	return (
		<>
			<div className="flex flex-col">
				<div className={'flex flex-row justify-between'}>
					<Text preset={'h1'} text={`Ajout d'un token à : ${currentPortfolio?.name}`} />
					<Text
						preset={'breadcrumb'}
						text={`Cryptobot > Portfolios > ${currentPortfolio?.name} > Ajout d'un token`}
					/>
				</div>
				<Text text={'Limites'} preset={'h2'} />
				<div className="mb-2">
					<Text preset={'default'} text={'Vous pouvez encore ajouter <strong>TODO</strong> tokens.'} />
				</div>
				<Text preset={'h2'} text={'Paramétrage'} />
				<Text preset={'h3'} text={'Choix du token'} />
				<div className="flex flex-wrap">
					<Button
						text={'#'}
						preset={currentLetter === '@' ? 'link-letter-dark' : 'link-letter'}
						isBold={currentLetter === '@'}
						onPress={(): void => setCurrentLetter('@')}
					/>
					-
					{new Array(26).fill(3).map((_, i) => {
						const letter = String.fromCharCode('A'.charCodeAt(0) + i)

						return (
							<span key={`span-${i}`} className={'flex'}>
								<Button
									key={`letter-${i}`}
									text={letter}
									preset={currentLetter === letter ? 'link-letter-dark' : 'link-letter'}
									isBold={currentLetter === letter}
									onPress={(): void => setCurrentLetter(letter)}
								/>
								-
							</span>
						)
					})}
				</div>
				<Select
					options={tokensSelect}
					preset={'with-image'}
					onChange={handleChangeToken}
					// selected={portfolioStore.currentToken?.id}
				/>
				<div className="mb-4">
					<Text preset={'small'} text={'Données fournies par coingecko et zerion.io'} italic={true} />
					<Button
						preset={'link-dark'}
						text={"Votre token n'est pas dans la liste ?"}
						onPress={handleNewToken}
					/>
				</div>
				<PortfolioTransactions mode={'custom'} />
				<div className="flex w-full items-center justify-center gap-4 mt-8">
					<Button text={'Revenir'} preset={'cancel'} onPress={handleAnnuler} />
					<Button
						text={'Valider'}
						preset={'default'}
						disabled={tokenTransactions.filter((t) => t._isValidated).length === 0}
						onPress={handleValiderToken}
					/>
				</div>
			</div>

			<Modal
				title={"Ajout d'un nouveau token"}
				preset={'default'}
				titlePreset={'h2'}
				isOpen={isModalNewTokenOpen}
			>
				<div className="flex flex-col">
					<Text
						preset={'default'}
						text={
							"Vous pourrez prochainement ajouter des tokens non disponibles dans la liste, par exemple achetés lors d'une ICO et pas encore distribués."
						}
					/>
					<Button
						text={'Fermer'}
						preset={'cancel'}
						onPress={(): void => setIsModalNewTokenOpen(false)}
						centered
						className={'mt-4'}
					/>
				</div>
			</Modal>
		</>
	)
}

export default PortfolioAddToken
