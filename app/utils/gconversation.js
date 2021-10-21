const gconversation = require('../models/gconversations')

const createGroup = async (data, userId) => {
  try {
    const request = new gconversation({
      is_admin: [userId],
      title: data.title,
      description: data.desc
    })
    const store = await request.save()
    return { status: true, message: store }
  } catch (error) {
    return { status: false, message: error.message }
  }
}

module.exports = { createGroup }