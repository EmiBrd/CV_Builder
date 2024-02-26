import mongoose from 'mongoose'

let userSchema: mongoose.Schema | null = null

export const getUserSchema = (): mongoose.Schema => {
  if (!userSchema) {
    userSchema = new mongoose.Schema({
      username: {
        type: String,
        required: [true, 'Please provide unique username'],
        unique: [true, 'This username exists'],
      },
      password: {
        type: String,
        required: [true, 'Please provide a password'],
      },
      email: {
        type: String,
        required: [true, 'Please provide unique email'],
        unique: true,
      },
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      mobile: {
        type: String,
        unique: true,
      },
      address: {
        type: String,
      },
      profileImage: { type: String },
      otpCode: { type: String, unique: [true, 'This OTP code exists'] },
      isActiveSession: { type: Boolean },
      isAccountConfirmed: { type: Boolean },
    })
  }
  return userSchema
}

export default mongoose.model('CV_Template', getUserSchema())
