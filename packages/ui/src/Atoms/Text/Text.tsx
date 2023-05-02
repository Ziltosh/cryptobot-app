import "../../index.css";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { convertFromMarkdown } from "@cryptobot/tools/src/string";

export const TextPresets = [
	'h1',
	'h2',
	'h3',
	'h4',
	'default',
	'breadcrumb',
	'footer',
	'portfolioWallet',
	'portfolioAddress',
	'small',
	'logs',
] as const

type TextProps = {
	preset?: (typeof TextPresets)[number]
	centered?: boolean
	bold?: boolean
	italic?: boolean
	text: string
	className?: string
}

const baseClasses = ['dark:text-white', 'text-black', 'font-sans', 'leading-normal']

const classes: Record<(typeof TextPresets)[number], string[]> = {
	default: baseClasses,
	h1: [...baseClasses, 'text-2xl', 'font-bold', 'mb-3'],
	h2: [...baseClasses, 'text-xl', 'font-bold', 'mb-2'],
	h3: [...baseClasses, 'text-xl', 'font-medium', 'mb-2'],
	h4: [...baseClasses, 'text-lg', 'mb-2'],
	breadcrumb: [...baseClasses, 'text-sm', 'text-slate-500'],
	footer: [...baseClasses, 'text-sm', 'text-slate-500'],
	portfolioWallet: [...baseClasses, 'text-md', 'font-medium', 'text-slate-800'],
	portfolioAddress: [...baseClasses, 'text-md', 'text-slate-800'],
	small: [...baseClasses, 'text-sm', 'text-slate-800'],
	logs: [...baseClasses, 'text-sm', 'text-slate-400'],
}

export const Text = (props: PropsWithChildren<TextProps>) => {
	const classesToApply = twMerge(
		classes[props.preset || 'default'],
		props.centered ? 'text-center' : '',
		props.bold ? 'font-bold' : '',
		props.italic ? 'italic' : '',
		props.className || ''
	)

	return <div className={classesToApply} dangerouslySetInnerHTML={{ __html: convertFromMarkdown(props.text) }} />
}
