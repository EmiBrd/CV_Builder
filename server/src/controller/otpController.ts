import { Request, Response } from 'express'
import { OTP_MESSAGE } from '../constants'
import otpGenerator from 'otp-generator'
import userModel from '../model/userModel'

// export const generateOTP = async (req: Request, res: Response) => {
// 	// req.otp.otpCode = otpGenerator.generate(6, {
// 	req.app.locals.otpCode = otpGenerator.generate(6, {
// 		lowerCaseAlphabets: false,
// 		upperCaseAlphabets: false,
// 		specialChars: false
// 	});

// 	return res.status(201).send({ code: req.app.locals.otpCode });
// };
export const generateOTP = async (): Promise<string> => {
  const otpCode = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  })

  return otpCode
}

// export const verifyOTP = async (req: Request, res: Response) => {
//   const { code } = req.query

//   if (req.app.locals.otpCode === code) {
//     req.app.locals.otpCode = '' // reset the OTP value
//     req.app.locals.isActiveSession = true // start session
//     return res.status(201).send({ msg: OTP_MESSAGE.otpSuccessful })
//   }
//   return res.status(400).send({ error: OTP_MESSAGE.invalidOTP })
// }
export const verifyOTP = async (req: Request, res: Response) => {
  const { code } = req.query
  const user = req.user

  if (user.otpCode === code) {
    const otpCode = ''
    const isActiveSession = true

    await userModel.updateOne(
      { username: user.username },
      { $set: { otpCode, isActiveSession } }
    )
    return res.status(201).send({ msg: OTP_MESSAGE.otpSuccessful })
  }
  return res.status(400).send({ error: OTP_MESSAGE.invalidOTP })
}

// // export const createActiveSession = async (req: Request, res: Response) => {
// // 	if (req.app.locals.isActiveSession) {
// // 		return res.status(201).send({ flag: req.app.locals.isActiveSession }); // session still active
// // 	}
// // 	return res.status(440).send({ error: OTP_MESSAGE.sessionExpired });
// // };
