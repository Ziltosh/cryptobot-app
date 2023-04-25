import {
	dbApiGetEVMERC20Transactions,
	dbApiGetEVMInternalTransactions,
	dbApiGetEVMNativeTokenBalance,
	dbApiGetEVMNormalTransactions,
	dbApiHandleBalance,
	dbApiHandleEVMERC20Transaction,
	dbApiHandleEVMInternalTransaction,
	dbApiHandleEVMNormalTransaction,
} from '@cryptobot/shared/src/front-desktop/main/process/dbApi.fn'
import {
	PortfolioMessage,
	PortfolioWalletsMessageResponse,
} from '@cryptobot/shared/src/front-desktop/preload/IpcMessage.types'
import { generateId } from '@cryptobot/shared/src/helpers/generateId.fn'

export const traiterBalanceTokenNatif = async ({
	wallet,
	blockchain,
	userToken,
	tokensRetour,
	tokenNatif,
	portfolio,
}): Promise<PortfolioWalletsMessageResponse['data']['evmBalanceTransactions']> => {
	const balance = await dbApiGetEVMNativeTokenBalance({
		address: wallet.address,
		blockchain_name: blockchain.display_name,
		userToken,
	})

	// On ajoute le token natif de la blockchain si il n'existe pas
	if (!tokensRetour.find((token) => token.api_token_id === tokenNatif.id)) {
		tokensRetour.push({
			id: generateId(10),
			_tokenApiData: tokenNatif,
			portfolio_id: portfolio.id,
			api_token_id: tokenNatif.id,
		})
	}

	console.log('dbApiHandleBalance', balance)

	const traitement = await dbApiHandleBalance({
		balance,
		blockchain_name: blockchain.display_name,
		userToken,
	})

	return traitement.map((traitement) => {
		return { ...traitement, _portfolio_wallet_id: wallet.id }
	})
}

export const traiterEVMTransactionsNormales = async ({
	process,
	wallet,
	blockchain,
	indexWallet,
	userToken,
	tokensRetour,
	tokenNatif,
	portfolio,
	wallets,
}): Promise<PortfolioWalletsMessageResponse['data']['evmNormalTransactions']> => {
	const evmNormaltransactionsRetour: PortfolioWalletsMessageResponse['data']['evmNormalTransactions'] = []

	const transactions = await dbApiGetEVMNormalTransactions({
		address: wallet.address,
		blockchain_name: blockchain.display_name,
		userToken,
	})

	console.log('transactions normales', transactions.length)

	let indexTransaction = 1
	for (const transaction of transactions) {
		///////
		const log: PortfolioMessage = {
			type: 'portfolio:log',
			data: `Traitement wallet ${indexWallet}/${wallets.length} | Traitement des transactions "normales" sur ${blockchain.display_name} ${indexTransaction}/${transactions.length}...`,
		}
		process.send(log)
		///////

		// On ajoyte le token natif de la blockchain si il n'existe pas
		if (!tokensRetour.find((token) => token.api_token_id === tokenNatif.id)) {
			tokensRetour.push({
				id: generateId(10),
				_tokenApiData: tokenNatif,
				portfolio_id: portfolio.id,
				api_token_id: tokenNatif.id,
			})
		}

		const traitement = await dbApiHandleEVMNormalTransaction({
			transaction,
			blockchain_name: blockchain.display_name,
			userToken,
			originAddress: wallet.address,
		})

		if (!traitement?.id) {
			indexTransaction++
			continue
		}

		let sens = 'in'
		if (traitement.is_inverse_transaction) {
			sens = transaction.from.toLowerCase() === wallet.address.toLowerCase() ? 'in' : 'out'
		} else {
			sens = transaction.from.toLowerCase() === wallet.address.toLowerCase() ? 'out' : 'in'
		}

		evmNormaltransactionsRetour.push({
			...traitement,
			_portfolio_wallet_id: wallet.id,
			sens: sens,
		})

		indexTransaction++
	}

	return evmNormaltransactionsRetour
}

export const traiterEVMTransactionsInternal = async ({
	process,
	wallet,
	blockchain,
	indexWallet,
	userToken,
	tokensRetour,
	tokenNatif,
	portfolio,
	wallets,
}): Promise<PortfolioWalletsMessageResponse['data']['evmInternalTransactions']> => {
	const evmInternaltransactionsRetour: PortfolioWalletsMessageResponse['data']['evmInternalTransactions'] = []

	const transactions = await dbApiGetEVMInternalTransactions({
		address: wallet.address,
		blockchain_name: blockchain.display_name,
		userToken,
	})

	console.log('transactions internes', transactions.length)

	let indexTransaction = 1
	for (const transaction of transactions) {
		///////
		const log: PortfolioMessage = {
			type: 'portfolio:log',
			data: `Traitement wallet ${indexWallet}/${wallets.length} | Traitement des transactions "internes" sur ${blockchain.display_name} ${indexTransaction}/${transactions.length}...`,
		}
		process.send(log)
		///////

		// On ajoyte le token natif de la blockchain si il n'existe pas
		if (!tokensRetour.find((token) => token.api_token_id === tokenNatif.id)) {
			tokensRetour.push({
				id: generateId(10),
				_tokenApiData: tokenNatif,
				portfolio_id: portfolio.id,
				api_token_id: tokenNatif.id,
			})
		}

		evmInternaltransactionsRetour.push({
			...(await dbApiHandleEVMInternalTransaction({
				transaction,
				blockchain_name: blockchain.display_name,
				userToken,
				originAddress: wallet.address,
			})),
			_portfolio_wallet_id: wallet.id,
			sens: transaction.from.toLowerCase() === wallet.address.toLowerCase() ? 'out' : 'in',
		})

		indexTransaction++
	}

	return evmInternaltransactionsRetour
}

export const traiterEVMTransactionsERC20 = async ({
	process,
	wallet,
	blockchain,
	indexWallet,
	userToken,
	tokensRetour,
	tokenNatif,
	portfolio,
	wallets,
}): Promise<PortfolioWalletsMessageResponse['data']['evmERC20Transactions']> => {
	const evmNormaltransactionsRetour: PortfolioWalletsMessageResponse['data']['evmERC20Transactions'] = []

	const transactions = await dbApiGetEVMERC20Transactions({
		address: wallet.address,
		blockchain_name: blockchain.display_name,
		userToken,
	})

	console.log('transactions ERC20', transactions.length)

	let indexTransaction = 1
	for (const transaction of transactions) {
		///////
		const log: PortfolioMessage = {
			type: 'portfolio:log',
			data: `Traitement wallet ${indexWallet}/${wallets.length} | Traitement des transactions "ERC20" sur ${blockchain.display_name} ${indexTransaction}/${transactions.length}...`,
		}
		process.send(log)
		///////

		// On ajoute le token natif de la blockchain si il n'existe pas
		if (!tokensRetour.find((token) => token.api_token_id === tokenNatif.id)) {
			tokensRetour.push({
				id: generateId(10),
				_tokenApiData: tokenNatif,
				portfolio_id: portfolio.id,
				api_token_id: tokenNatif.id,
			})
		}

		const traitement = await dbApiHandleEVMERC20Transaction({
			transaction,
			blockchain_name: blockchain.display_name,
			userToken,
			originAddress: wallet.address,
		})

		if (!traitement?.id) {
			indexTransaction++
			continue
		}

		evmNormaltransactionsRetour.push({
			...traitement,
			_portfolio_wallet_id: wallet.id,
			sens: transaction.from.toLowerCase() === wallet.address.toLowerCase() ? 'out' : 'in',
		})

		indexTransaction++
	}

	return evmNormaltransactionsRetour
}
