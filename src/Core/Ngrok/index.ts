import ngrok from '@ngrok/ngrok'

const PORT = process.env.PORT ?? 3001
const production = process.env.NODE_ENV === 'production'

let ngrokURL: string | undefined

(async () => {

	if (production) return

	const ngrok = await import('@ngrok/ngrok')

	const result = await ngrok.default.connect({
		addr: PORT,
		authtoken_from_env: true
	})

	process.on('SIGTERM', async () => {
		await ngrok.kill()
		process.exit(0)
	})

	process.on('SIGINT', async () => {
		await ngrok.kill()
		process.exit(0)
	})

	ngrokURL = result.url()
})()

export {
	ngrokURL
}