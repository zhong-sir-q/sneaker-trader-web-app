import { Router } from 'express'
import stripe from './routes/stripe'

export default () => {
  const app = Router()
  stripe(app)

  return app
}
