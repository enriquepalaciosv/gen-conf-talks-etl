const AWS = require("aws-sdk");

if (process.env.NODE_ENV === 'development') {
    AWS.config.update({
        endpoint: 'http://localhost:8000',
        region: 'us-east-1'
    });
}

const docClient = new AWS.DynamoDB.DocumentClient();

async function saveOnDynamoDB(talk) {
    try {
        const params = {
            TableName: process.env.GEN_CONF_TABLE_NAME,
            Item: talk,
        };

        await docClient.put(params, function (err, data) {
            if (err) {
                console.error(
                    "Unable to add talk",
                    `${talk.talkTitle}, ${talk.author}, ${talk.date}`,
                    ". Error JSON:",
                    JSON.stringify(err, null, 2)
                );

            } else {
                console.log(
                    "PutItem succeeded:",
                    `${talk.talkTitle}, ${talk.author}, ${talk.date}`
                );
            }
        }).promise();
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = {
    saveOnDynamoDB
}