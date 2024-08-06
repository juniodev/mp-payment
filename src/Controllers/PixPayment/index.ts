import {
   type Request,
   type Response
} from 'express'

import {
   payment
} from '../../Core/MercadoPago'
import {
   ngrokURL
} from '../../Core/Ngrok'

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

         const {
            id
         } = req.query

         const data = await payment.get({
            id: Number(id)
         })

         return res.status(200).json({
            status: data.status
         })

      } catch (error) {
         return res.sendStatus(400)
      }
   }

   @Post('/webhook/status/payment/pix/:id')
   async hookStatus(req: Request, res: Response) {

      const {
         type,
         data,
         action
      } = req.body

      if (action !== 'payment.updated') {
         return res.sendStatus(400)
      }

      // Verificar status do pagamento e executa funções auxiliares

      const result = await payment.get({
         id: data.id
      })
      
      console.log('Status pagamento: ', result.status)

      return res.sendStatus(200)
   }

}

export default PixPayment