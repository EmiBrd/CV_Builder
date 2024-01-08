import { useState } from 'react'
import LoginImg from '../assets/Login_img.png'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className='w-full h-full flex flex-row justify-evenly bg-slate-600'>
      <div className='w-1/4 h-full bg-white flex flex-col'>
        <span className='font-semibold text-[23px]'>Login</span>
        <div className='flex flex-row text-[16px]'>
          <span className='text-gray-400'>Doesn't have an account yet?</span>
          <span className='text-violet-500'>Sign up</span>
        </div>
        <div className='flex flex-col justify-center'>
          <span className='font-semibold'>Email Address</span>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            placeholder='you@example.com'
          />
        </div>
        <div className='flex flex-col justify-center'>
          <span className='font-semibold'>Email Address</span>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            type='password'
            placeholder='Enter 6 characters or more'
          />
        </div>
      </div>
      <div className='w-3/5 h-full flex justify-center bg-white'>
        <img src={LoginImg} alt='Login_img' />
      </div>
    </div>
  )
}

export default Login
