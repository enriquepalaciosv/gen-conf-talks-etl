const axios = require('axios')
const { getAccessToken, getManifest, getTalkByUri, saveOnDynamoDB } = require('./services')
const { getSession, getTalkOrder, cleanUri, formatTitle, createSynonym, formatAuthor } = require('./util')


exports.lambdaHandler = async (event, context) => {
    try {
        const token = await getAccessToken();
        const talkResponse = await getTalkByUri("/general-conference/2020/04/45nelson", token);
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
        console.log(dynamoResponse);

        const response = {
            statusCode: 200,
            body: JSON.stringify(dynamoResponse)
        }
        return response
    } catch (err) {
        console.log(err);
        return err;
    }

};
