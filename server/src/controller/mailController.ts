import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import ENV from '../config/config';
import { generateOTP } from './otpController';

const nodeConfig = {
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: ENV.EMAIL,
		pass: ENV.PASSWORD
	}
};

const transporter = nodemailer.createTransport(nodeConfig);

export const confirmEmailRegistration = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;
	const otpCode = await generateOTP();

	const mailOptions = {
		from: {
			name: 'CV_Builder',
			address: ENV.EMAIL
		},
		to: [ ENV.EMAIL ],
		subject: 'OTP code to confirm registration',
		text: 'Hello',
		// html: `<h2>${email}, otpCode=${otpCode}</h2>`
		html: `Dear ${username},

		<br></br>
		<br>Thank you for signing up. We're excited to have you on board. Here are your account details:<br>
		
		<h3>Username: ${username}</h3>
		<h3>Email: ${email}</h3>
		<h3>Password: ${password}</h3>
		
		Use this code <strong>${otpCode}</strong>. Enjoy your new account.
		
		<br>In case of any questions, contact support at "support@gmail.com".</br>
		
		<br></br>
		<br>Best regards,</br>
		<br>Emi, Junior Frontend Developer</br>
		CV Builder`
		// cc: [ 'doarTestez@ceva.com' ]
	};

	try {
		transporter.sendMail(mailOptions);
		return res.status(200).send({ msg: 'Email was sent' });
	} catch (error) {
		return res.status(500).send({ error });
	}
};
