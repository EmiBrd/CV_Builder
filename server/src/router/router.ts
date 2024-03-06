import { Router } from 'express'
import { auth, verifyUser } from '../middleware/auth'
import {
  confirmRegisteredAccount,
  deleteUser,
  getUser,
  login,
  register,
  resetPassword,
  sendOTPViaEmail,
  updateUser,
} from '../controller/userController'
import { verifyOTP } from '../controller/otpController'

const router = Router()

/** Register */
router.route('/register').post(register) // Nr 1
router
  .route('/confirmRegisteredAccount/:username')
  .get(confirmRegisteredAccount) // Nr 2

/** Login */
router.route('/login').post(login) // Nr 3

/** Reset password */
// router.route('/resetPassword').put(verifyUser, resetPassword) // 6
router.route('/resetPassword').put(resetPassword) // 6

/** User */
router.route('/user/:username').get(getUser)
router.route('/userUpdate').put(auth, updateUser)
router.route('/userDelete').delete(auth, deleteUser)

/** OTP */
// router.route('/generateOTP').get(verifyUser, variablesForOTP, generateOTP);
router.route('/sendOTPViaEmail').post(sendOTPViaEmail) // 4
// router.route('/verifyOTP').get(verifyUser, verifyOTP) // 5
router.route('/verifyOTP').put(verifyOTP) // 5

export default router
