export interface UserToken {
	type: 'bearer'
	token: string
	expires_at: Date
}
