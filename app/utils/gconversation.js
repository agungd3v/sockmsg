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

const getGconversation = async gid => {
  try {
    const request = await gconversation.findOne({
      _id: gid
    }).populate('is_admin').populate('is_user').populate('messages.is_user')
    return { status: true, message: request }
  } catch (error) {
    return { status: false, message: error.message }
  }
}

const InGmessage = async (rayId, data) => {
  try {
    const request = await gconversation.findOneAndUpdate(
      { _id: rayId },
      { $push: { messages: data } },
      { new: true }
    ).populate('is_admin').populate('is_user').populate('messages.is_user')
    return { status: true, message: request }
  } catch (error) {
    return { status: false, message: error.message }
  }
}

module.exports = { createGroup, getGconversation, InGmessage }