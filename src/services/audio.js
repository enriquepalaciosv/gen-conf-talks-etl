const { getAccessToken, saveVerseAudioOnDynamoDB } = require('../services')
const axios = require('axios');

async function processAudio(id) {
    const audioData = await getAudioById(id);
    const audioObject =
    {
        title: '',
        audio: '',
        book: '',
        chapter: '',
        displayTitle: '',
        scripture: '',
        verse: '',
        source: 'AudioContentPipeline'
    }

    const dynamoResponse = await saveVerseAudioOnDynamoDB(audioObject);
    return dynamoResponse;

}

async function getAudioById(id) {
    try {
        const token = await getAccessToken();
        const data = JSON.stringify({
            "$model": "ldsSource.USE-AUDIO-SYNTAX-HERE",
            "$lang": "eng",
            "$limit": 100,
            "$offset": 0,
            "$as": "audio_v1",
            "$filter": {
                "html/@data-uri": {
                    "$sw": id
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

module.exports = {
    processAudio
};