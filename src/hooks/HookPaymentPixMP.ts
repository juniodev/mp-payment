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
   action: yup.string().required(),
   data: yup.object().shape({
      id: yup.number().required(),
   })
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

      const { action, data: { id } } = await yupSchema.validate(req.body, {
         abortEarly: true
      })


      if (action === 'payment.updated') {

         mp.configurations.setAccessToken(process.env.MP_TOKEN)

         const response = await mp.payment.get(id)

         if (response.body.status === PaymentStatus.Approved) {

            console.log('Approved')

            // Faça algo para caso o pagamento seja aprovado

            return res.status(200).end()
         }

         if (response.body.status === PaymentStatus.Cancelled) {

            // Faça algo se o pagamento cancelado

            return res.status(200).end()
         }

         if (response.body.status !== PaymentStatus.Approved) {
            return res.status(400).end()
         }

         return res.status(200).end()

      }

   } catch (error) {
      if (error instanceof yup.ValidationError) {
         return res.status(400).json(
            {
               success: false,
               message: error.message
            }
         )
      }
      return res.sendStatus(400).end()
   }
}
