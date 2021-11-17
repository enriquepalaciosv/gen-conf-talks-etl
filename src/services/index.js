const { getAccessToken } = require('./token');
const { getManifest } = require('./manifest');
const { getTalkByUri, processTalk } = require('./talk');
const { saveGenConfTalkOnDynamoDB, saveVerseAudioOnDynamoDB } = require('./db');
const { processAudio } = require('./audio');

module.exports = {
    getAccessToken, getManifest, getTalkByUri, saveGenConfTalkOnDynamoDB, saveVerseAudioOnDynamoDB, processTalk, processAudio
};