import { Request, Response } from "express";
import mp from 'mercadopago';
import * as yup from 'yup';

const yupSchema = yup.object().shape({
   title: yup.string().required(),
   email: yup.string().required().email(),
   name: yup.string().required(),
   productId: yup.string().required(),
   price: yup.number().required()
})

export default async (req: Request, res: Response) => {

   if (!process.env.MP_TOKEN) {
      return res.status(500).json(
         {
            success: false,
            message: 'Erro interno do servidor entre em contato com o suporte'
         }
      )
   }

   try {

      const { price, title, email, name, productId } = await yupSchema.validate(req.body,
         {
            abortEarly: true
         }
      )

      if (name.split(' ').length < 2) {
         return res.status(400).json(
            {
               success: false,
               message: 'Digite seu nome completo'
            }
         )
      }

      const payment_data = {
         transaction_amount: price,
         description: title,
         payment_method_id: 'pix',
         payer: {
            email: email,
            first_name: name[0],
            last_name: name[1]
         },
         notification_url: getFullHostName(req.hostname, productId),
         installments: 0
      }

      mp.configurations.setAccessToken(
         process.env.MP_TOKEN
      )

      const { response } = await mp.payment.create(payment_data)

      const paymentData = {
         id: response.id,
         status: response.status,
         qr_code: response.point_of_interaction.transaction_data.qr_code,
         qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
         ticket_url: response.point_of_interaction.transaction_data.ticket_url,
         date_created: response.date_created,
         date_of_expiration: response.date_of_expiration
      }

      return res.status(201).json(
         {
            success: true,
            payment: paymentData
         }
      )

   } catch (error) {
      console.log(error);

      if (error instanceof yup.ValidationError) {
         return res.status(400).json(
            {
               success: false,
               message: error.message
            }
         )
      }
      return res.status(400).json(
         {
            success: false,
            message: 'Não foi possível concluir sua solicitação, tente novamente em alguns instantes.'
         }
      )
   }

}

function getFullHostName(hostname: string, id: string): string {
   return `https://${hostname}/api/v1/payment/status/notification/${id}`
}
