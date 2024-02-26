import { NextFunction, Request, Response } from 'express'
import { AUTH_MESSAGE, USER_MESSAGE } from '../constants'
import jwt from 'jsonwebtoken'
import ENV from '../config/config'
import userModel from '../model/userModel'
import { generateOTP } from '../controller/otpController'

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
    const userExist = await userModel.findOne({ username })
    if (!userExist)
      return res.status(404).send({ error: USER_MESSAGE.userNotFound })
    next()
  } catch (error) {
    return res.status(404).send({ error: AUTH_MESSAGE.authFailed })
  }
}

export const variablesForOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user

  const otpCode = ''
  const isActiveSession = false

  // Update user in the database with the generated OTP and isActiveSession
  await userModel.updateOne(
    { username: user.username },
    { $set: { otpCode, isActiveSession } }
  )

  next()
}
// export function variablesForOTP(req: Request, res: Response, next: NextFunction) {
// 	req.app.locals = {
// 		otpCode: '',
// 		isActiveSession: false
// 	};
// 	next();
// }
