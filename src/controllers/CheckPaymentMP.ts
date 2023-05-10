import { Request, Response } from 'express';
import mp from 'mercadopago';
import * as yup from 'yup';

export enum PaymentStatus {
   Pending = 'pending',
   Approved = 'approved',
   Error = 'error',
   Cancelled = 'cancelled'
}

const yupSchema = yup.object().shape({
   id: yup.number().required()
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

      const { id } = await yupSchema.validate(req.body, {
         abortEarly: true
      })

      mp.configurations.setAccessToken(process.env.MP_TOKEN)

      const { response } = await mp.payment.get(id)

      if (response.status === PaymentStatus.Approved) {
         return res.status(200).json(
            {
               success: false,
               message: 'Seu pagamento foi aprovado'
            }
         )
      }

      const paymentData = {
         id: response.id,
         status: response.status,
         qr_code: response.point_of_interaction.transaction_data.qr_code,
         qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
         ticket_url: response.point_of_interaction.transaction_data.ticket_url,
         date_created: response.date_created,
         date_of_expiration: response.date_of_expiration
      }

      return res.status(200).json(
         {
            success: true,
            payment: paymentData
         }
      )

   } catch (error) {
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
            message: 'Não foi possível obter as informações de pagamento'
         }
      )
   }
}
