const { getAccessToken } = require("./token");
const { saveVerseAudioOnDynamoDB } = require("./db");
const axios = require("axios");

function getMetaValue(key, collection) {
  return collection.find((m) => m.key === key).value;
}

async function processAudio(id) {
  const audioFromApi = await getAudioById(id);
  if (audioFromApi) {
    const { metadata, distributionUri } = audioFromApi;
    const audioTitle = getMetaValue("publicTitle", metadata);
    const audioBook = audioTitle.split(" ")[0];
    const audioChapter = audioTitle.split(" ")[1].split(":")[0];
    const audioVerse = audioTitle.split(" ")[1].split(":")[1];

    const audioObject = {
      title: audioTitle,
      audio: distributionUri,
      book: audioBook,
      chapter: audioChapter,
      verse: audioVerse,
      displayTitle: audioTitle,
      scripture: "ot",
      source: "AudioContentPipeline",
    };
    console.log("Audio to be saved", audioObject);
    const dynamoResponse = await saveVerseAudioOnDynamoDB(audioObject);
    return dynamoResponse;
  }
}

async function getAudioById(id) {
  try {
    const token = await getAccessToken();
    const config = {
      method: "get",
      url: `${process.env.CHURCH_API}/pub-svcs/titanapi/assetsearch/api/v1/asset/details/id/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(`[${id}] AUDIO fetch error`, error);
  }
}

module.exports = {
  processAudio,
};
