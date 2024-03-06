import { Request, Response } from 'express'
import {
  validateEmail,
  validateFirstNameOrLastNameOrAddress,
  validatePassword,
  validateUsername,
} from '../service/userService'
import userModel from '../model/userModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ENV from '../config/config'
import { EMAIL_MESSAGE, OTP_MESSAGE, USER_MESSAGE } from '../constants'
import {
  sendEmailContainingOTP,
  sendEmailToConfirmRegisteredAccount,
} from './mailController'
import { generateOTP } from './otpController'

export const register = async (req: Request, res: Response) => {
  const {
    username,
    password,
    email,
    firstName,
    lastName,
    mobile,
    address,
    profileImage,
  } = req.body

  try {
    if (!validateUsername(username)) throw USER_MESSAGE.usernameIsTooShort
    /** if username exists throw exception */
    const usernameExists = await userModel.findOne({ username })
    if (usernameExists) throw USER_MESSAGE.usernameExists

    if (!validateEmail(email)) throw USER_MESSAGE.emailIsInvalid
    /** if email exists throw exception */
    const emailExists = await userModel.findOne({ email })
    if (emailExists) throw USER_MESSAGE.emailExists

    if (!validateFirstNameOrLastNameOrAddress(firstName))
      throw USER_MESSAGE.firstNameIsTooShort
    if (!validateFirstNameOrLastNameOrAddress(lastName))
      throw USER_MESSAGE.lastNameIsTooShort
    if (!validateFirstNameOrLastNameOrAddress(address))
      throw USER_MESSAGE.addressIsTooShort

    if (!validatePassword(password)) throw USER_MESSAGE.passwordIsInvalid
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new userModel({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      mobile,
      address,
      profileImage,
      otpCode: '',
      isActiveSession: false,
      isAccountConfirmed: false,
    })
    await user.save()

    await sendEmailToConfirmRegisteredAccount({
      username,
      email,
      password,
    })

    return res
      .status(201)
      .send({ msg: USER_MESSAGE.userRegisteredSuccessfully })
  } catch (error) {
    return res.status(500).send({ error })
  }
}

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  try {
    const user: any = await userModel.findOne({ username })
    if (!user) throw USER_MESSAGE.wrongCredentials
    try {
      const checkPasswordsMatch = await bcrypt.compare(password, user.password)
      if (!checkPasswordsMatch) throw USER_MESSAGE.wrongCredentials

      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
        },
        ENV.JWT_SECRET,
        { expiresIn: '24h' }
      )
      return res.status(201).send({
        msg: USER_MESSAGE.loginSuccessful,
        username: user.username,
        token,
      })
    } catch (error) {
      return res.status(400).send({ error })
    }
  } catch (error) {
    return res.status(404).send({ error })
  }
}

export const getUser = async (req: Request, res: Response) => {
  const { username } = req.params
  try {
    if (!username)
      return res.status(501).send({ error: USER_MESSAGE.usernameIsInvalid })
    const user = await userModel.findOne({ username })
    if (!user)
      return res.status(501).send({ error: USER_MESSAGE.userDataNotFound })

    const { password, ...restOfUserData } = Object.assign({}, user.toJSON())
    return res.status(200).send(restOfUserData)
  } catch (error) {
    return res.status(404).send({ error: USER_MESSAGE.userDataNotFound })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user
    if (!userId)
      return res.status(401).send({ error: USER_MESSAGE.userNotFound })
    const userBody = req.body
    try {
      const user = await userModel.findOne({ _id: userId })
      if (!user)
        return res.status(401).send({ error: USER_MESSAGE.userDataNotUpdated })
      Object.assign(user, userBody)
      await user.save()
      return res.status(202).send({ msg: USER_MESSAGE.userDataUpdated })
    } catch (error) {
      return res.status(401).send({ error: USER_MESSAGE.userNotFound })
    }
  } catch (error) {
    return res.status(401).send({ error })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user

    if (!userId)
      return res.status(401).send({ error: USER_MESSAGE.userNotFound })

    const deletedUser = await userModel.findByIdAndDelete(userId)

    if (!deletedUser)
      return res.status(404).send({ error: USER_MESSAGE.userNotFound })

    return res.status(200).send({ msg: USER_MESSAGE.userDeletedSuccessfully })
  } catch (error) {
    return res.status(500).send({ error })
  }
}

export const confirmRegisteredAccount = async (req: Request, res: Response) => {
  try {
    const { username } = req.params
    /** check the user existance */
    const userExist = await userModel.findOne({ username })
    if (!userExist)
      return res.status(404).send({ error: USER_MESSAGE.userNotFound })

    if (userExist.isAccountConfirmed)
      res.status(101).send({ info: 'User already confirmed' })

    await userModel.updateOne(
      { username: userExist.username },
      { $set: { isAccountConfirmed: true } }
    )

    return res.status(200).send({ msg: USER_MESSAGE.userDataUpdated })
  } catch (error) {
    return res.status(404).send({ error })
  }
}

export const sendOTPViaEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body
    try {
      const user = await userModel.findOne({ email })
      if (!user)
        return res.status(404).send({ error: USER_MESSAGE.userNotFound })

      const generatedOtpCode = await generateOTP()

      await userModel.updateOne(
        { email: user.email },
        {
          $set: { otpCode: generatedOtpCode, isActiveSession: false },
        } /** the session to reset the password is stoped */
      )

      await sendEmailContainingOTP(email, generatedOtpCode)

      return res.status(200).send({ msg: EMAIL_MESSAGE.otpSentSuccessfully })
    } catch (error) {
      return res.status(500).send({ error: EMAIL_MESSAGE.otpSentFailed })
    }
  } catch (error) {
    return res.status(401).send({ error })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    try {
      const user = await userModel.findOne({ username })
      if (!user)
        return res.status(404).send({ error: USER_MESSAGE.userNotFound })

      console.log(`in resetPassword`)
      console.log(`user.username=${user.username}`)
      console.log(`user.isActiveSession=${user.isActiveSession}`)

      if (!user.isActiveSession)
        return res.status(440).send({ error: OTP_MESSAGE.sessionExpired })

      const hashedPassword = await bcrypt.hash(password, 10)

      await userModel.updateOne(
        { username: user.username },
        {
          $set: { password: hashedPassword, isActiveSession: false },
        } /** the session to reset the password is stoped */
      )

      return res
        .status(200)
        .send({ msg: USER_MESSAGE.passwordResetSuccessfully })
    } catch (error) {
      return res.status(500).send({ error: USER_MESSAGE.unableToHashPassword })
    }
  } catch (error) {
    return res.status(401).send({ error })
  }
}
