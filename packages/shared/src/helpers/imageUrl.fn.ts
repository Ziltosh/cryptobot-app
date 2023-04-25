export const getImageUrl = (
	logo_downloaded: boolean,
	type: 'tokens' | 'blockchains' | 'exchanges',
	id: string,
	url: string
) => {
	return logo_downloaded ? `assets/${type}/${id.charAt(0)}/${id}.webp` : url
}
