const user = require('../models/user')
const { Duplex } = require('stream')
const { googleDriveService } = require('../config/asset')

function bufferToStream(buff) {
  let tmp = new Duplex()
  tmp.push(buff)
  tmp.push(null)
  return tmp
}

const changePhoto = async (data) => {
  const fileMetadata = {
    'name': 'test2.webp',
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
}

const getUser = async (data) => {
  const request = await googleDriveService.files.get({
    fileId: "1yNpDjYXAn8SBAOqDePgyn7JOwkXPrgM-"
  })
  return request
}

const searchUser = async (data) => {
  try {
    const request = await user.find({ fullname: {
      "$regex": `.*${data}`, "$options": "i"
    }})
    return { status: true, message: request }
  } catch (error) {
    return {
      status: false,
      message: error.message
    }
  }
}

module.exports = { changePhoto, getUser, searchUser }