import {
	MercadoPagoConfig,
	Payment
} from 'mercadopago'

if (!process.env.MP_TOKEN) {
	throw new Error('MP_TOKEN not defined in .env file')
}

const client = new MercadoPagoConfig( {
	accessToken: process.env.MP_TOKEN,
	options: {
		timeout: 5000
	}
})

const payment = new Payment(client)

export {
	payment
}