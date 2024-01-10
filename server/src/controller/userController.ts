import { Request, Response } from 'express';
import {
	validateEmail,
	validateFirstNameOrLastNameOrAddress,
	validatePassword,
	validateUsername
} from '../service/userService';
import userModel from '../model/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config/config';
import { OTP_MESSAGE, USER_MESSAGE } from '../constants';

export const register = async (req: Request, res: Response) => {
	const { username, password, email, firstName, lastName, mobile, address, profileImage } = req.body;

	try {
		if (!validateUsername(username)) throw USER_MESSAGE.usernameIsTooShort;
		// if username exists throw exception
		const usernameExists = await userModel.findOne({ username });
		if (usernameExists) throw USER_MESSAGE.usernameExists;

		if (!validateEmail(email)) throw USER_MESSAGE.emailIsInvalid;
		// if email exists throw exception
		const emailExists = await userModel.findOne({ email });
		if (emailExists) throw USER_MESSAGE.emailExists;

		if (!validateFirstNameOrLastNameOrAddress(firstName)) throw USER_MESSAGE.firstNameIsTooShort;
		if (!validateFirstNameOrLastNameOrAddress(lastName)) throw USER_MESSAGE.lastNameIsTooShort;
		if (!validateFirstNameOrLastNameOrAddress(address)) throw USER_MESSAGE.addressIsTooShort;

		if (!validatePassword(password)) throw USER_MESSAGE.passwordIsInvalid;
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new userModel({
			username,
			password: hashedPassword,
			email,
			firstName,
			lastName,
			mobile,
			address,
			profileImage: profileImage
		});
		await user.save();
		return res.status(201).send({ msg: USER_MESSAGE.userRegisteredSuccessfully });
	} catch (error) {
		return res.status(500).send({ error });
	}
};

export const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	try {
		const user: any = await userModel.findOne({ username });
		if (!user) throw USER_MESSAGE.wrongCredentials;
		try {
			const checkPasswordsMatch = await bcrypt.compare(password, user.password);
			if (!checkPasswordsMatch) throw USER_MESSAGE.wrongCredentials;

			const token = jwt.sign(
				{
					userId: user._id,
					username: user.username
				},
				ENV.JWT_SECRET,
				{ expiresIn: '24h' }
			);
			return res.status(201).send({
				msg: USER_MESSAGE.loginSuccessful,
				username: user.username,
				token
			});
		} catch (error) {
			return res.status(400).send({ error });
		}
	} catch (error) {
		return res.status(404).send({ error });
	}
};

export const getUser = async (req: Request, res: Response) => {
	const { username } = req.params;
	try {
		if (!username) return res.status(501).send({ error: USER_MESSAGE.usernameIsInvalid });
		const user = await userModel.findOne({ username });
		if (!user) return res.status(501).send({ error: USER_MESSAGE.userDataNotFound });

		const { password, ...restOfUserData } = Object.assign({}, user.toJSON());
		return res.status(200).send(restOfUserData);
	} catch (error) {
		return res.status(404).send({ error: USER_MESSAGE.userDataNotFound });
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		// const id = req.query.id;
		console.log('req.body in updateUser');
		console.log(req.body);
		const { userId } = req.user;
		if (!userId) return res.status(401).send({ error: USER_MESSAGE.userNotFound });
		const userBody = req.body;
		try {
			const user = await userModel.findOne({ _id: userId });
			if (!user) return res.status(401).send({ error: USER_MESSAGE.userDataNotUpdated });
			Object.assign(user, userBody);
			await user.save();
			return res.status(202).send({ msg: USER_MESSAGE.userDataUpdated });
		} catch (error) {
			return res.status(401).send({ error: USER_MESSAGE.userNotFound });
		}
	} catch (error) {
		return res.status(401).send({ error });
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	if (!req.app.locals.resetSession) return res.status(440).send({ error: OTP_MESSAGE.sessionExpired });

	try {
		const { username, password } = req.body;
		try {
			const user = await userModel.findOne({ username });
			if (!user) return res.status(404).send({ error: USER_MESSAGE.userNotFound });

			console.log('Here1');
			const hashedPassword = await bcrypt.hash(password, 10);
			console.log(hashedPassword);

			await userModel.updateOne({ username: user.username }, { password: hashedPassword });
			console.log('Here3');

			req.app.locals.resetSession = false; // reset session

			return res.status(200).send({ msg: USER_MESSAGE.passwordResetSuccessfully });
		} catch (error) {
			return res.status(500).send({ error: USER_MESSAGE.unableToHashPassword });
		}
	} catch (error) {
		return res.status(401).send({ error });
	}
};
