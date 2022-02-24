const { processTalk, processAudio } = require('./services')

exports.lambdaHandler = async (event, context) => {
    try {
        console.log('event', event);
        const { Records } = event;
        const savedEntries = []
        const uris = [];
        const audios = [];

        for (const r of Records) {
            const body = JSON.parse(r.body);
            console.log('body', body);
            const message = JSON.parse(body.Message)
            console.log('message', message);
            if (message.headers.event === "PUBLISH" && message.headers.context === "general-conference") {
                uris.push(message.uri);
            }
            if (message.headers.event === "PUBLISH" && message.headers.itemType === "AUDIO") {
                audios.push(message.uri || message.id);
            }
        }

        // General conference talks processing
        if (uris.length > 0) {
            for (const uri of uris) {
                const talk = await processTalk(uri)
                savedEntries.push(talk);
            }
        }

        // Old testament audios processing
        if (audios.length > 0) {
            for (const audioId of audios) {
                const audio = await processAudio(audioId);
                savedEntries.push(audio);
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ savedEntries })
        }

    } catch (err) {
        console.log(err);
        return err;
    }

};
