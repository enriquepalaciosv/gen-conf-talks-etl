const axios = require('axios');

async function getManifest(year, month, token) {
    try {

        const data = JSON.stringify({
            "$model": "ldsSource.general-conference",
            "$lang": "eng",
            "$limit": 100,
            "$offset": 0,
            "$as": "manifest_v1",
            "$filter": {
                "html/@data-uri": {
                    "$sw": `/general-conference/${year}/${month}`
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

exports.getManifest = getManifest;