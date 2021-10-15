const path = require('path')
const { google } = require('googleapis')

// GOOGLE DRIVE CONFIG
const KEY = path.resolve('app/credentials/vcbox-gdrive.json')
const SCOPES = ['https://www.googleapis.com/auth/drive']

const googleDriveAuth = new google.auth.GoogleAuth({ keyFile: KEY, scopes: SCOPES })
const googleDriveService = google.drive({ version: 'v3', auth: googleDriveAuth })

module.exports = { googleDriveService }