import {
	type Request,
	type Response
} from 'express'

import {
	payment
} from '../../Core/MercadoPago'
import { ngrokURL } from '../../Core/Ngrok'

import {
	Post,
	Get
} from '../../Routing'

class PixPayment {

	@Post('/payment/pix/create')
	async create(req: Request, res: Response) {
		try {
			
			const url = `https://${req.hostname}`
			
			const notificationURL = `${ngrokURL ?? url}/webhook/status/payment/pix/123`
			
			console.log(notificationURL)

			const body = {
				body: {
					description: 'Rifa JBL',
					transaction_amount: 0.01,
					payment_method_id: 'pix',
					payer: {
						email: 'juniomoralt19@gmail.com'
					},
					notification_url: notificationURL
				}
			}

			const data = await payment.create(body)

			return res.status(201).json(data)

		} catch (error) {
			return res.status(500).json({
				error: error
			})
		}
	}

	@Get('/payment/pix/verify')
	async verify(req: Request, res: Response) {
		try {
			
			const { id } = req.query
			
			const data = await payment.get({id})
			
			return res.status(200).json(data)
			
		} catch (error) {
			return res.sendStatus(400)
		}
	}

	@Post('/webhook/status/payment/pix/:id')
	async hookStatus(req: Request, res: Response) {
		console.log(req.body)
		const { 
			type, data, action
		} = req.body
		
		if (action !== 'payment.updated') {
			return res.sendStatus(400)
		}
		
		if (type !== 'payment') {
			return res.sendStatus(400)
		}
		
		console.log(req.body)
		
		return res.sendStatus(200)
	}

}

export default PixPayment