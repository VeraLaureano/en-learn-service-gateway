import express, { Response } from 'express'
import cors from 'cors'
import { experienceRouter } from './routes/userExperience.route'
import { routes } from './config/routes'
import { AuthenticatedRequest } from './interface/AuthRequest.interface'
import { userRouter } from './routes/user.route'
import { wordsRouter } from './routes/words.route'

const app = express()

app.use(express.json({ limit: '1mb' }))
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(routes.experience, experienceRouter)
app.use(routes.user, userRouter)
app.use(routes.words, wordsRouter)

app.use('/', (_req: AuthenticatedRequest, res: Response) => {
  res.send('SERVER_GATEWAY')
})

export default app