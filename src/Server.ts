import cors from 'cors'
import { config } from 'dotenv'
import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import routers from './routes/ServerRoutes'

const app = express();
config();

const PORT = process.env.PORT || 3001

app.use(urlencoded({ extended: false }))
app.use(json())
app.use(cors({
   origin: '*'
}))
app.use(helmet())
app.use(routers)

app.listen(PORT, () => {
   console.log('Listening on port %s', PORT)
})
