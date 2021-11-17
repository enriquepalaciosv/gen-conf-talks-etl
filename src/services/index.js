const { getAccessToken } = require('./token');
const { getManifest } = require('./manifest');
const { getTalkByUri, processTalk } = require('./talk');
const { saveOnDynamoDB } = require('./db');
const { processAudio } = require('./audio');

module.exports = {
    getAccessToken, getManifest, getTalkByUri, saveOnDynamoDB, processTalk, processAudio
};