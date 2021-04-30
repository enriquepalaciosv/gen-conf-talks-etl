const { getAccessToken } = require('./token');
const { getManifest } = require('./manifest');
const { getTalkByUri } = require('./talk');
const { saveOnDynamoDB } = require('./db');

module.exports = {
    getAccessToken, getManifest, getTalkByUri, saveOnDynamoDB
};