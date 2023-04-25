import { Balances, Market, PartialBalances, Trade, Transaction } from 'ccxt'

export interface CcxtTransaction extends Transaction {}

export interface CcxtMarket extends Market {}

export interface CcxtTrade extends Trade {}

export interface CcxtBalances extends Balances {}

export interface CcxtPartialBalances extends PartialBalances {}
