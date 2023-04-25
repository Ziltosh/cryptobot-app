export function dateMinusModuloXMin(x: number): Date {
	let now: Date = new Date()
	now.setMinutes(now.getMinutes() - (now.getMinutes() % x))
	return new Date(now.getTime())
}
