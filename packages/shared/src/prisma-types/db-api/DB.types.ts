import { Exchange, Limit, Portfolio, Prisma } from "./client";

export type PortfolioCloudDB = Portfolio

export const offersWithLimits = Prisma.validator<Prisma.OfferArgs>()({
	include: { Limits: true },
})
export type OfferWithLimitsDB = Prisma.OfferGetPayload<typeof offersWithLimits>

export type LimitDB = Limit

export type ExchangeDB = Exchange

export type TokenDB = Prisma.TokenGetPayload<{}>
export type BlockchainDB = Prisma.BlockchainGetPayload<{}>
export type UserDB = Prisma.UserGetPayload<{}>

export type EVMBalanceTransactionDB = Prisma.EVMBalanceTransactionGetPayload<{}>
export type EVMNormalTransactionDB = Prisma.EVMNormalTransactionGetPayload<{}> & {
	is_inverse_transaction?: boolean
}
export type EVMInternalTransactionDB = Prisma.EVMInternalTransactionGetPayload<{}>
export type EVMERC20TransactionDB = Prisma.EVMERC20TransactionGetPayload<{}>

const nativeTokenBlockchainWithToken = Prisma.validator<Prisma.NativeTokenBlockchainArgs>()({
	include: {
		Token: {
			include: {
				Exchanges: true,
			},
		},
	},
})
export type NativeTokenBlockchainWithTokenDB = Prisma.NativeTokenBlockchainGetPayload<
	typeof nativeTokenBlockchainWithToken
>
