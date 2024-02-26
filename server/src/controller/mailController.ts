import { Request, Response } from 'express'
import nodemailer from 'nodemailer'
import ENV from '../config/config'
import { generateOTP } from './otpController'
import { BASE_URL, EMAIL_MESSAGE } from '../constants'

export interface UsernameEmailPasswordI {
  username: string
  email: string
  password: string
}

const nodeConfig = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: ENV.EMAIL,
    pass: ENV.PASSWORD,
  },
}

const transporter = nodemailer.createTransport(nodeConfig)

export const sendEmailToConfirmRegisteredAccount = async (
  uep: UsernameEmailPasswordI
) => {
  const { username, email, password } = uep

  const mailOptions = {
    from: {
      name: 'CV_Builder',
      address: ENV.EMAIL,
    },
    to: [ENV.EMAIL],
    subject: 'Confirmation email',
    text: 'Hello',
    html: `Dear ${username},

		<br></br>
		<br>Thank you for signing up. We're excited to have you on board. Here are your account details:<br>
		
		<h3>Username: ${username}</h3>
		<h3>Email: ${email}</h3>
		<h3>Password: ${password}</h3>
		
		Use this link to confirm your account: <strong>${BASE_URL}/confirmRegisteredAccount/${username}</strong>. Enjoy your new account.
		
		<br>In case of any questions, contact support at "support@gmail.com".</br>
		
		<br></br>
		<br>Best regards,</br>
		<br>Emi, Junior Frontend Developer</br>
		CV Builder`,
    // cc: [ 'doarTestez@ceva.com' ]
  }

  const sentMail = await transporter.sendMail(mailOptions)
  if (!sentMail) throw EMAIL_MESSAGE.confirmationEmailFailed
  // try {
  //   // return res.status(200).send({ msg: 'Email was sent' })
  // } catch (error) {
  //   return res.status(500).send({ error })
  // }
}

// export const confirmEmailRegistration = async (req: Request, res: Response) => {
//   const { username, email, password } = req.body
//   const generatedOtpCode = await generateOTP()

//   const mailOptions = {
//     from: {
//       name: 'CV_Builder',
//       address: ENV.EMAIL,
//     },
//     to: [ENV.EMAIL],
//     subject: 'OTP code to confirm registration',
//     text: 'Hello',
//     html: `Dear ${username},

// 		<br></br>
// 		<br>Thank you for signing up. We're excited to have you on board. Here are your account details:<br>

// 		<h3>Username: ${username}</h3>
// 		<h3>Email: ${email}</h3>
// 		<h3>Password: ${password}</h3>

// 		Use this code <strong>${generatedOtpCode}</strong>. Enjoy your new account.

// 		<br>In case of any questions, contact support at "support@gmail.com".</br>

// 		<br></br>
// 		<br>Best regards,</br>
// 		<br>Emi, Junior Frontend Developer</br>
// 		CV Builder`,
//     // cc: [ 'doarTestez@ceva.com' ]
//   }

//   try {
//     transporter.sendMail(mailOptions)
//     return res.status(200).send({ msg: 'Email was sent' })
//   } catch (error) {
//     return res.status(500).send({ error })
//   }
// }
