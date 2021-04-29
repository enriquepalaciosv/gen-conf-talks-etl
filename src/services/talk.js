const axios = require('axios');

async function getTalkByUri(uri, token) {
    try {

        const data = JSON.stringify({
            "$model": "ldsSource.general-conference",
            "$lang": "eng",
            "$limit": 100,
            "$offset": 0,
            "$as": "audio_v1",
            "$filter": {
                "html/@data-uri": {
                    "$sw": uri
                }
            }
        });

        const config = {
            method: 'post',
            url: process.env.CHURCH_API,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios(config);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }

}

exports.getTalkByUri = getTalkByUri;