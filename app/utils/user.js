const user = require('../models/user')
const group = require('../models/gconversations')
const { Duplex } = require('stream')
const { googleDriveService } = require('../config/asset')

function bufferToStream(buff) {
  let tmp = new Duplex()
  tmp.push(buff)
  tmp.push(null)
  return tmp
}

const deletePhoto = async (photoid) => {
  try {
    await googleDriveService.files.delete({ fileId: photoid })
    return { status: true }
  } catch (error) {
    return { status: false, message: error.message }
  }
}

const changePhoto = async (data, userid) => {
  try {
    const fileMetadata = {
      'name': `vpr_${userid}`,
      'parents': ['1wBj5lrq-ZOCM3lsZyNWuCe965eeik03P']
    }
    const media = {
      mimeType: 'image/webp',
      body: bufferToStream(data)
    }
    const request = await googleDriveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    })
    return request
  } catch (error) {
    return { status: false, message: error.message }
  }
}

const updateUserPhoto = async (userid, photoid) => {
  try {
    const request = await user.findOneAndUpdate(
      { _id: userid },
      { $set: { photo: photoid} },
      { new: true }
    )
    return { status: true, message: request }
  } catch (error) {
    return { status: false, message: error.message }
  }
}

const searchUser = async (data) => {
  try {
    const request = await user.find({ fullname: {
      "$regex": `.*${data}`, "$options": "i"
    }})
    const request2 = await group.find({ title: {
      "$regex": `.*${data}`, "$options": "i"
    }})
    return { status: true, message: { user: request, group: request2 } }
  } catch (error) {
    return {
      status: false,
      message: error.message
    }
  }
}

module.exports = { changePhoto, updateUserPhoto, deletePhoto, searchUser }