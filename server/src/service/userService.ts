export const validateUsername = (username: string) => {
  return username.length >= 4
}

export const validatePassword = (password: string) => {
  /** Check for at least one uppercase letter, one lowercase letter, one special character, and a minimum length of 6 characters */
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).{6,}$/
  return passwordRegex.test(password)
}

export const validateEmail = (email: string) => {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
}

export const validateFirstNameOrLastNameOrAddress = (value: string) => {
  return value.length >= 2
}
