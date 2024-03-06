import { Router } from 'express'
import { auth } from '../middleware/auth'
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
router.route('/register').post(register) /** Nr 1 */
router
  .route('/confirmRegisteredAccount/:username')
  .get(confirmRegisteredAccount) /** Nr 2 */

/** Login */
router.route('/login').post(login) /** Nr 3 */

/** Reset password */
router.route('/resetPassword').put(resetPassword) /** Nr 6 */

/** User */
router.route('/user/:username').get(getUser)
router.route('/userUpdate').put(auth, updateUser)
router.route('/userDelete').delete(auth, deleteUser)

/** OTP */
router.route('/sendOTPViaEmail').post(sendOTPViaEmail) /** Nr 4 */
router.route('/verifyOTP').put(verifyOTP) /** Nr 5 */

export default router
