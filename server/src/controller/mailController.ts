import nodemailer from 'nodemailer'
import ENV from '../config/config'
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
  secure: false /** true for 465, false for other ports */,
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
    /** cc: [ 'doarTestez@ceva.com' ] */
  }

  const sentMail = await transporter.sendMail(mailOptions)
  if (!sentMail) throw EMAIL_MESSAGE.confirmationEmailFailed
}

export const sendEmailContainingOTP = async (
  email: string,
  generatedOtpCode: string
) => {
  const mailOptions = {
    from: {
      name: 'CV_Builder',
      address: ENV.EMAIL,
    },
    to: [ENV.EMAIL],
    subject: 'OTP code',
    text: 'Hello',
    html: `Dear user,

		<br></br>
    <br>We received a request to generate an OTP code from this email address <strong>${email}</strong></br>
		<br>Thank you for your recent request for a One-Time Password (OTP).<br>

		<h3>Your OTP is: <strong>**${generatedOtpCode}**</strong> </h3>
		
    Please use this OTP to complete your transaction or login process.
    <br>Remember, this OTP is valid for only 10 minutes from the time you received this email.</br>

    <br>If you did not request this OTP, please ignore this email.</br>
		<br>In case of any questions, contact support at "support@gmail.com".</br>

		<br></br>
		<br>Thank you,</br>
		<br>Emi, Junior Frontend Developer</br>
		CV Builder`,
    /** cc: [ 'doarTestez@ceva.com' ] */
  }

  const sentMail = await transporter.sendMail(mailOptions)
  if (!sentMail) throw EMAIL_MESSAGE.confirmationOTPFailed
}
