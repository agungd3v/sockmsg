const hash = require('password-hash')
const user = require('../models/user')

const register = async (emit) => {
  const request = new user({
    fullname: emit.name,
    email: emit.email,
    phone: emit.phone,
    password: hash.generate(emit.password)
  })
  try {
    const store = await request.save()
    return { status: true, message: store }
  } catch (error) {
    return { status: false, message: error.message }
    throw error
  }
}

const login = async (emit) => {
  try {
    const request = await user.findOne(
        { phone: emit.phone }
    ).select('+password')
    if (request) {
      const passwordVerify = hash.verify(emit.password, request.password)
      if (passwordVerify) {
        const data = await user.findOne({ phone: request.phone })
        return { status: true, message: data }
      } else {
        return { status: false, message: 'Incorrect password, check your password again' }
      }
    } else {
      return { status: false, message: 'Incorrect email or username or password' }
    }
  } catch (error) {
    return { status: false, message: error.message }
    throw error
  }
}

module.exports = { register, login }