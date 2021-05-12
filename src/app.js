const axios = require('axios')
const { getAccessToken, getManifest, getTalkByUri, saveOnDynamoDB } = require('./services')
const { getSession, getTalkOrder, cleanUri, formatTitle, createSynonym, formatAuthor } = require('./util')


exports.lambdaHandler = async (event, context) => {
    try {
        console.log('event', event);
        const { Records } = event;
        const savedTalks = []
        const uris = [];

        for (const r of Records) {
            const body = JSON.parse(r.body);
            console.log('body', body);
            const message = JSON.parse(body.Message)
            console.log('message', message);
            if (message.headers.event === "PUBLISH" && message.headers.context === "general-conference") {
                uris.push(message.uri);
            }
        }

        if (uris.length > 0) {
            const token = await getAccessToken();
            for (const uri of uris) {
                const talk = await processTalk(uri, token)
                savedTalks.push(talk);
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ savedTalks })
        }

    } catch (err) {
        console.log(err);
        return err;
    }

};


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

    const dynamoResponse = await saveOnDynamoDB(talkObject);
    return dynamoResponse;
}
