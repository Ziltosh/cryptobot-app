import { Poloniex } from '../exchanges/Poloniex'

// const bybit = new Bybit()
// console.log(
// 	await bybit.fetchBalances({
// 		apiKey: 'DUaXu6xdBRKdzAeuts',
// 		secret: '',
// 		phrase: '',
// 	})
// )

// const kraken = new Kraken()
// console.log(
// 	await kraken.fetchBalances({
// 		apiKey: 'yiC+VuYDLVTVisx6dRfAt6NixRHOCDsOgI7sWTOpdVJbo6JqJr7m8s/i',
// 		secret: '',
// 		phrase: '',
// 	})
// )

const poloniex = new Poloniex()
console.log(
	await poloniex.fetchBalances({
		apiKey: '7WJESZQ0-FX367D8O-J5J064JJ-2DIZVWTQ',
		secret: '850d9a72189df65426f4efd14eccfee07777fd1e6c7a99405d484a8995f7da5c80e5cd25405ccb2c134c61491488008f8befeedf72cb07545f62212881fc4b7f',
		phrase: '',
	})
)
