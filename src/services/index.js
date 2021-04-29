const { getAccessToken } = require('./token');
const { getManifest } = require('./manifest');
const { getTalkByUri } = require('./talk');

module.exports = {
    getAccessToken, getManifest, getTalkByUri
};