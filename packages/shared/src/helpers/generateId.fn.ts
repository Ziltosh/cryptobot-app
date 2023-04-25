export const generateId = (size = 10): string =>
	Math.ceil(Math.random() * (Math.pow(10, size) - 1))
		.toString()
		.padStart(size, '0')
