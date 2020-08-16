import { Router, Response, Request } from 'express'

import stripe from '../../config/stripe'
import { runAsyncWrapper, formatCreateSessionOption } from '../../utils'
import { FormatCreateSessionOptionArgs } from '../../declarations'

const route = Router()

export default (app: Router) => {
  app.use('/checkoutSession', route)
  route.get('/', runAsyncWrapper(async (req: Request<any>, res: Response<any>) => {
    const session = await stripe.checkout.sessions.create(formatCreateSessionOption(req.query as FormatCreateSessionOptionArgs));

    res.json({ sessionId: session.id });
  }))
}
