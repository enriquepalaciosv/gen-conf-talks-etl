const axios = require('axios');
const { getAccessToken, getManifest, getTalkByUri, saveGenConfTalkOnDynamoDB } = require('../services')
const { getSession, getTalkOrder, cleanUri, formatTitle, createSynonym, formatAuthor } = require('../util')

async function getTalkByUri(uri) {
    try {
        const token = await getAccessToken();
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

async function processTalk(uri, token) {
    const talkResponse = await getTalkByUri(uri, token);
    const talk = talkResponse.data.items[0];
    const manifest = await getManifest(talk.year, talk.month, token);
    const { sessionOrder, sessionName } = getSession(talk.uri, manifest);
    const talkOrder = getTalkOrder(talk.uri, manifest);

    const talkObject =
    {
        date: `${talk.year}-${talk.month}`,
        year: talk.year,
        month: talk.month,
        audio: talk.audio.other,
        session: sessionName,
        sessionOrder,
        talkOrder,
        uri: cleanUri(talk.uri),
        talkTitle: formatTitle(talk.title),
        talkTitleSynonym: createSynonym(talk.title),
        author: formatAuthor(talk.author.name),
        source: 'GenConfContentPipeline'
    }

    const dynamoResponse = await saveGenConfTalkOnDynamoDB(talkObject);
    return dynamoResponse;
}


module.exports = {
    getTalkByUri, processTalk
};
