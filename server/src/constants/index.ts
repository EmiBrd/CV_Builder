export const USER_MESSAGE = {
  userRegisteredSuccessfully: 'User register succesfully',
  usernameExists: 'This username already exists',
  usernameIsTooShort: 'Username must be at least 4 characters long',
  usernameIsInvalid: 'Invalid username',
  userDataNotFound: 'Cannot find user data',
  userDataNotUpdated: 'Cannot update user data',
  userDataUpdated: 'Updated user data',
  userNotFound: 'User not found',
  emailExists: 'This email already exists',
  emailIsInvalid: 'Please provide a valid email address',
  passwordIsInvalid:
    'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one special character',
  wrongCredentials: 'Wrong credentials',
  loginSuccessful: 'Login successful',
  firstNameIsTooShort: 'First name must be at least 2 characters long',
  lastNameIsTooShort: 'Last name must be at least 2 characters long',
  addressIsTooShort: 'Address must be at least 2 characters long',
  unableToHashPassword: 'Unable to hash password',
  passwordResetSuccessfully: 'Password reset successfully',
  userDeletedSuccessfully: 'User deleted successfully',
}

export const AUTH_MESSAGE = {
  authFailed: 'Authentication failed',
}

export const OTP_MESSAGE = {
  otpSuccessful: 'OTP code verified successsfully',
  invalidOTP: 'Invalid OTP',
  sessionExpired: 'Session expired',
}

export const EMAIL_MESSAGE = {
  confirmationEmailFailed: 'Could not send confirmation email',
  confirmationOTPFailed: 'Could not send OTP code via email',
  otpSentSuccessfully: 'Otp sent successfully',
  otpSentFailed: 'Failed to send OTP code',
}

export const BASE_URL = 'http://localhost:5000/api'
