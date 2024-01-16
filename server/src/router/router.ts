import { Request, Response, Router } from 'express';
import { auth, variablesForOTP, verifyUser } from '../middleware/auth';
import { getUser, login, register, resetPassword, updateUser } from '../controller/userController';
import { generateOTP, verifyOTP } from '../controller/otpController';
import { confirmEmailRegistration } from '../controller/mailController';

const router = Router();

/** Register */
router.route('/register').post(register);
router.route('/registerMail').post((req: Request, res: Response) => res.json('register route'));

/** Login */
router.route('/login').post(login);
router.route('/confirmEmailRegistration').post(confirmEmailRegistration);

/** Reset password */
router.route('/resetPassword').put(verifyUser, resetPassword);

/** User */
router.route('/user/:username').get(getUser);
router.route('/userUpdate').put(auth, updateUser);

/** OTP */
router.route('/generateOTP').get(verifyUser, variablesForOTP, generateOTP);
router.route('/verifyOTP').get(verifyUser, verifyOTP);

export default router;
