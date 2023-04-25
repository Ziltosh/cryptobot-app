import '../../index.css'
import { twMerge } from 'tailwind-merge'
import { BlockchainDB, ExchangeDB, TokenDB } from '@cryptobot/db-api'
import { getImageUrl } from '@cryptobot/shared/src/helpers/imageUrl.fn'

type PresetProps = {
	exchange: {
		data: ExchangeDB | null
	}
	blockchain: {
		data: BlockchainDB | null
	}
	token: {
		data: TokenDB | null
	}
}

type Preset = keyof PresetProps

type Props<P extends Preset> = PresetProps[P] & {
	preset: P
	name: string
	withText?: boolean
}

const baseClasses: string[] = ['flex', 'flex-row', 'items-center', 'gap-1']

const classes: Record<keyof PresetProps, string[]> = {
	exchange: [...baseClasses],
	token: [...baseClasses],
	blockchain: [...baseClasses],
}

export const LogoItem = <P extends Preset>(props: Props<P>) => {
	const classesToApply = twMerge(classes[props.preset || 'exchange'])

	if (props.preset === 'exchange') {
		const castProps = props as Props<'exchange'>

		return (
			<div className={classesToApply}>
				{castProps.data && (
					<img
						title={castProps.data.name}
						className={'w-6 h-6 aspect-square object-contain rounded-full'}
						src={getImageUrl(
							castProps.data.logo_downloaded,
							'exchanges',
							castProps.data.id,
							castProps.data.logo || ''
						)}
						alt={castProps.data.name}
					/>
				)}

				{props.withText && <span>{props.name}</span>}
			</div>
		)
	} else if (props.preset === 'blockchain') {
		const castProps = props as Props<'blockchain'>

		return (
			<div className={classesToApply}>
				{castProps.data && (
					<img
						title={castProps.data.name}
						className={'w-6 h-6 aspect-square object-contain rounded-full'}
						src={getImageUrl(
							castProps.data.logo_downloaded,
							'blockchains',
							castProps.data.id,
							castProps.data.logo || ''
						)}
						alt={castProps.data.name}
					/>
				)}
				{props.withText && <span>{props.name}</span>}
			</div>
		)
	} else if (props.preset === 'token') {
		const castProps = props as Props<'token'>

		return (
			<div className={classesToApply}>
				{castProps.data && (
					<img
						className={'w-6 h-6 aspect-square object-contain rounded-full'}
						src={getImageUrl(
							castProps.data.logo_downloaded,
							'tokens',
							castProps.data.id,
							castProps.data.logo || ''
						)}
						alt={castProps.data.name}
					/>
				)}
				{props.withText && <span>{props.name}</span>}
			</div>
		)
	}

	return <></>
}
