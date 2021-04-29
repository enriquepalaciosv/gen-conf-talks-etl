var axios = require('axios');
var qs = require('qs');

async function getAccessToken() {
    var data = qs.stringify({
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'grant_type': 'client_credentials',
        'scope': 'profile openid'
    });
    var config = {
        method: 'post',
        url: process.env.TOKEN_ENDPOINT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data
    };

    const response = await axios(config);
    return response.data.id_token;

}

exports.getAccessToken = getAccessToken;