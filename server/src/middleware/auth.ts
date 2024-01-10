import { NextFunction, Request, Response } from 'express'
import { AUTH_MESSAGE, USER_MESSAGE } from '../constants'
import jwt from 'jsonwebtoken'
import ENV from '../config/config'
import userModel from '../model/userModel'

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization.split(' ')[1]

  const decodedToken = jwt.verify(token, ENV.JWT_SECRET)

  req.user = decodedToken
  next()
  try {
  } catch (error) {
    res.status(401).send({ error: AUTH_MESSAGE.authFailed })
  }
}

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.method == 'GET' ? req.query : req.body

    // check the user existance
    let usernameExist = await userModel.findOne({ username })
    if (!usernameExist)
      return res.status(404).send({ error: USER_MESSAGE.userNotFound })
    next()
  } catch (error) {
    return res.status(404).send({ error: AUTH_MESSAGE.authFailed })
  }
}

export function variablesForOTP(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.app.locals = {
    otpCode: '',
    resetSession: false,
  }
  next()
}
