import { NextFunction, Request, Response } from "express"

export const error = (error: any, req: Request, res: Response, next: NextFunction) => {
   if (error) {
     return res.status(400).json(
       {
         success: false,
         message: 'Invalid request'
       }
     )
   }
   next()
 }
