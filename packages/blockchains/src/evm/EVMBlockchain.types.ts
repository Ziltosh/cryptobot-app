export interface EVMBalance {
	status: string
	message: string
	result: string
	address?: string
}

export interface EVMNormalTransaction {
	blockNumber: string
	timeStamp: string
	hash: string
	nonce: string
	blockHash: string
	transactionIndex: string
	from: string
	to: string
	value: string
	gas: string
	gasPrice: string
	isError: string
	txreceipt_status: string
	input: string
	contractAddress: string
	cumulativeGasUsed: string
	gasUsed: string
	confirmations: string
	methodId: string
	functionName: string
}

export interface EVMInternalTransaction {
	blockNumber: string
	timeStamp: string
	hash: string
	from: string
	to: string
	value: string
	contractAddress: string
	input: string
	type: string
	gas: string
	gasUsed: string
	traceId: string
	isError: string
	errCode: string
}

export interface EVMERC20Transaction {
	blockNumber: string
	timeStamp: string
	hash: string
	nonce: string
	blockHash: string
	from: string
	contractAddress: string
	to: string
	value: string
	tokenName: string
	tokenSymbol: string
	tokenDecimal: string
	transactionIndex: string
	gas: string
	gasPrice: string
	gasUsed: string
	cumulativeGasUsed: string
	input: string
	confirmations: string
}

/////////////

export type EVMNormalTransactionResponse = {
	status: string
	message: string
	result: EVMNormalTransaction[]
}

export type EVMInternalTransactionResponse = {
	status: string
	message: string
	result: EVMInternalTransaction[]
}

export type EVMERC20TransactionResponse = {
	status: string
	message: string
	result: EVMInternalTransaction[]
}
