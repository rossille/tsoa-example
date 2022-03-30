import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import { RegisterRoutes } from '../build/routes'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../build/swagger.json'
import { ValidateError } from '@tsoa/runtime'

async function startServer (): Promise<void> {
  const app = express()

  const apiRouter = express.Router()

  apiRouter.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  apiRouter.use(bodyParser.json())

  RegisterRoutes(apiRouter)

  const apiErrorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof ValidateError) {
      return res.status(422).json({
        message: 'Validation Failed',
        details: err?.fields,
      })
    }
    if (err instanceof Error) {
      return res.status(500).json({
        message: 'Internal Server Error',
      })
    }

    next()
  }

  apiRouter.use(apiErrorHandler)

  app.use('/api', apiRouter)

  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  await new Promise((resolve) => {
    app.listen(3000, () => {
      console.log('Server started')
      console.log('API available at http://localhost:3000/api')
      console.log('Doc available at http://localhost:3000/doc')
    })
  })
}

startServer().catch(console.error)
