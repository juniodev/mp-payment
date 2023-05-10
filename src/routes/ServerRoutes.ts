import { Router } from 'express';
import CheckPaymentMP from '../controllers/CheckPaymentMP';
import CreatePaymentPix from '../controllers/CreatePaymentPix';
import HookPaymentPixMP from '../hooks/HookPaymentPixMP';

const route = Router()

route.post('/api/v1/create/payment/pix', CreatePaymentPix)
route.post('/api/v1/payment/status/notification', HookPaymentPixMP)
route.get('/api/v1/payment/status', CheckPaymentMP)

export default route
