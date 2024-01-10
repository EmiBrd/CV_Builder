import { Request, Response } from 'express';
import { OTP_MESSAGE } from '../constants';
import otpGenerator from 'otp-generator';

export const generateOTP = async (req: Request, res: Response) => {
	// req.otp.otpCode = otpGenerator.generate(6, {
	req.app.locals.otpCode = otpGenerator.generate(6, {
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false
	});

	res.status(201).send({ code: req.app.locals.otpCode });
};

export const verifyOTP = async (req: Request, res: Response) => {
	const { code } = req.query;

	if (req.app.locals.otpCode === code) {
		req.app.locals.otpCode = ''; // reset the OTP value
		req.app.locals.resetSession = true; // start session for reset password
		return res.status(201).send({ msg: OTP_MESSAGE.otpSuccessful });
	}
	return res.status(400).send({ error: OTP_MESSAGE.invalidOTP });
};

export const createResetSession = async (req: Request, res: Response) => {
	if (req.app.locals.resetSession) {
		return res.status(201).send({ flag: req.app.locals.resetSession });
	}
	return res.status(440).send({ error: OTP_MESSAGE.sessionExpired });
};
