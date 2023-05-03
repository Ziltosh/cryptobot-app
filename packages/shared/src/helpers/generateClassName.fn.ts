import { capitalize } from "@cryptobot/tools/src/string";

export const generateClassName = (str: string) => {
	str = str.replace(/[^a-zA-Z0-9]/g, '')
	str = str.toLowerCase()
	str = capitalize(str)
	return str
}
