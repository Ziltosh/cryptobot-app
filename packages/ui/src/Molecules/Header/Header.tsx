import '../../index.css'
import { twMerge } from 'tailwind-merge'
import { Icon } from '../../Atoms/Icon/Icon'
import { FaEye, FaEyeSlash, FaRobot, FaUser } from 'react-icons/all'
import { Text } from '../../Atoms/Text/Text'
import { useLogStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/LogStore'
import { useUserStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/UserStore'
import { useMiscStore } from '@cryptobot/shared/src/front-desktop/renderer/stores/MiscStore'

const presets = ['default'] as const

type Props = {
	preset?: (typeof presets)[number]
	centered?: boolean
	onClickUser?: () => void
}

const baseClasses = ['sticky bg-amber-500 px-3 py-2 flex flex-1 flex-row justify-between']

const classes: Record<(typeof presets)[number], string[]> = {
	default: baseClasses,
}

export const Header = (props: Props) => {
	const classesToApply = twMerge(classes[props.preset || 'default'], props.centered ? 'text-center' : '')

	const userStore = useUserStore()
	const miscStore = useMiscStore()
	const portfolio = useLogStore((state) => state.portfolio)

	return (
		<nav className={classesToApply}>
			<Icon flex={'col'} icon={<FaRobot size={40} className={'text-white ml-2'} />} preset={'default'} />

			<div className="flex flex-col w-2/3 bg-white rounded-md px-2">
				<div className="flex flex-row h-full items-center">
					<Text text={'Portfolio'} preset={'default'} className={'font-medium w-20'} />
					<Text preset={'logs'} text={portfolio.at(-1) || 'En attente...'} />
				</div>
				{/*<div className="flex flex-row">*/}
				{/*	<Text text={'Portfolio'} preset={'default'} className={'font-medium'} />*/}
				{/*</div>*/}
			</div>

			<div className="flex space-x-4 text-white">
				{/*<Icon flex={'col'} icon={<MdOutlineSettings size={20} />} preset={'withText'} text={'Réglages'} />*/}

				{!miscStore.discretModeActivated && (
					<Icon
						flex={'col'}
						icon={<FaEyeSlash size={20} />}
						preset={'header'}
						text={'discret'}
						onClick={() => {
							console.log('discret mode')
							miscStore.setDiscretModeActivated(true)
						}}
					/>
				)}
				{miscStore.discretModeActivated && (
					<Icon
						flex={'col'}
						icon={<FaEye size={20} />}
						preset={'header'}
						text={'normal'}
						onClick={() => miscStore.setDiscretModeActivated(false)}
					/>
				)}

				<Icon
					flex={'col'}
					icon={<FaUser size={20} />}
					preset={'header'}
					text={userStore?.user?.login || 'Invité'}
					onClick={props.onClickUser}
				/>
			</div>
		</nav>
	)
}
