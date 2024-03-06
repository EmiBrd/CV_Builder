import { Request, Response } from 'express';
import { OTP_MESSAGE, USER_MESSAGE } from '../constants';
import otpGenerator from 'otp-generator';
import userModel from '../model/userModel';

export const generateOTP = async (): Promise<string> => {
	const otpCode = await otpGenerator.generate(6, {
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false
	});

	return otpCode;
};

export const verifyOTP = async (req: Request, res: Response) => {
	const { email, code } = req.query;

	const user = await userModel.findOne({ email });
	if (!user) return res.status(404).send({ error: USER_MESSAGE.userNotFound });

	console.log(`in verifyOTP`);
	console.log(`user.email=${user.email}`);
	console.log(`user.username=${user.username}`);
	console.log(`user.otpCode=${user.otpCode}`);
	console.log(`user.isActiveSession=${user.isActiveSession}`);
	console.log(`code=${code}`);

	if (user.otpCode === code) {
		// await userModel.updateOne(
		// 	{ username: user.username },
		// 	{ otpCode: '' },
		// 	{ isActiveSession: !user.isActiveSession } // start session for reset password
		// 	// { isActiveSession: true } // start session for reset password
		// 	// { $set: { otpCode, isActiveSession } }
		// );
		await userModel.updateOne(
			{ username: user.username },
			{
				$set: {
					otpCode: '',
					isActiveSession: !user.isActiveSession
				}
			}
		);
		return res.status(201).send({ msg: OTP_MESSAGE.otpSuccessful });
	}
	return res.status(400).send({ error: OTP_MESSAGE.invalidOTP });
};

// export const verifyOTP = async (req: Request, res: Response) => {
//   const { code } = req.query
//   const user = req.user

//   if (user.otpCode === code) {
//     const otpCode = ''
//     const isActiveSession = true // start session for reset password

//     await userModel.updateOne(
//       { username: user.username },
//       { otpCode: otpCode },
//       { isActiveSession: isActiveSession }
//       // { $set: { otpCode, isActiveSession } }
//     )
//     return res.status(201).send({ msg: OTP_MESSAGE.otpSuccessful })
//   }
//   return res.status(400).send({ error: OTP_MESSAGE.invalidOTP })
// }

// // export const createActiveSession = async (req: Request, res: Response) => {
// // 	if (req.app.locals.isActiveSession) {
// // 		return res.status(201).send({ flag: req.app.locals.isActiveSession }); // session still active
// // 	}
// // 	return res.status(440).send({ error: OTP_MESSAGE.sessionExpired });
// // };
