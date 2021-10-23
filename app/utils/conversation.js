const conversation = require("../models/conversations")
const gconversation = require("../models/gconversations")

const getConversation = async (from, to) => {
  try {
    const request = await conversation.findOneAndUpdate(
      { $or: [
        { is_user: [from, to] },
        { is_user: [to, from] }
      ] },
      { $set: { is_user: [from, to] } },
      { upsert: true, new: true }
    ).populate('is_user').populate('messages.is_user')
    return { status: true, message: request }
  } catch (error) {
    return { status: false, message: error.message }
  }
}

const listConversation = async (from) => {
  try {
    const request = await conversation.find(
      {
        is_user: { $in: [from] },
        messages: { $exists: true }
      }
    ).populate('is_user').populate('messages.is_user')
    const request2 = await gconversation.find(
      { $or: [
          { is_user: { $in: [from] } },
          { is_admin: { $in: [from] } }
        ]
      }
    ).populate('is_user').populate('is_admin').populate('messages.is_user')
    return { status: true, message: { single: request, group: request2 } }
  } catch (error) {
    return { status: false, message: error.message }
  }
}

const InMessage = async (rayId, data) => {
  try {
    const request = await conversation.findOneAndUpdate(
      { _id: rayId },
      { $push: { messages: data } },
      { new: true }
    ).populate('is_user').populate('messages.is_user')
    return { status: true, message: request }
  } catch (error) {
    return { status: false, message: error.message }
  }
}

module.exports = { getConversation, listConversation, InMessage }