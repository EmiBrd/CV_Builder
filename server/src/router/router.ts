import auth from '../middleware/auth';
import { getUser, login, register, updateUser } from '../controller/userController';
import { Request, Response, Router } from 'express';

const router = Router();

/** Register */
router.route('/register').post(register);
router.route('/registerMail').post((req: Request, res: Response) => res.json('register route'));

/** Login */
router.route('/login').post(login);

/** Get user */
router.route('/user/:username').get(getUser);
router.route('/userUpdate').put(auth, updateUser);
router.route('/resetPassword').put();

/** OTP */
router.route('/generateOTP').get();
router.route('/verifyOTP').get();

export default router;
