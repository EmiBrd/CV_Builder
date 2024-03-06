import { Request, Response } from 'express'
import { OTP_MESSAGE, USER_MESSAGE } from '../constants'
import otpGenerator from 'otp-generator'
import userModel from '../model/userModel'

export const generateOTP = async (): Promise<string> => {
  const otpCode = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  })

  return otpCode
}

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, code } = req.query

  const user = await userModel.findOne({ email })
  if (!user) return res.status(404).send({ error: USER_MESSAGE.userNotFound })

  console.log(`in verifyOTP`)
  console.log(`user.email=${user.email}`)
  console.log(`user.username=${user.username}`)
  console.log(`user.otpCode=${user.otpCode}`)
  console.log(`user.isActiveSession=${user.isActiveSession}`)
  console.log(`code=${code}`)

  if (user.otpCode === code) {
    await userModel.updateOne(
      { username: user.username },
      {
        $set: {
          otpCode: '',
          isActiveSession: !user.isActiveSession,
        },
      }
    )
    return res.status(201).send({ msg: OTP_MESSAGE.otpSuccessful })
  }
  return res.status(400).send({ error: OTP_MESSAGE.invalidOTP })
}
