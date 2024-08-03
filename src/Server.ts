import express, {
	json,
	raw,
	text,
	urlencoded
} from 'express'

import morgan from 'morgan'

import cors from 'cors'
import helmet from 'helmet'

import {
	routes
} from './Routing'

const app = express()

const PORT = process.env.PORT ?? 3001
const production = process.env.NODE_ENV === 'production'

if (production) app.set('trust proxy', 1)

if (!production) {
	app.use(morgan('dev'))
}

app.use(urlencoded( {
	limit: '5kb',
	extended: false
}))
app.use(json( {
	limit: '15kb'
}))
app.use(text( {
	limit: 0,
}))
app.use(raw( {
	limit: 0
}))

app.use(cors( {
	origin: '*'
}))
app.use(helmet())

app.use(routes)

app.listen(PORT, async () => {
	console.log('Server running', {
		port: PORT,
		production
	})
})