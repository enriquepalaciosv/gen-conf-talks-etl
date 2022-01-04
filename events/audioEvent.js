const lambdaEvent = {
    Records: [
        {
            body: JSON.stringify({
                Message: JSON.stringify({
                    headers: {
                        event: "PUBLISH",
                        itemType: "AUDIO"
                    },
                    uri: "ea59c65a4d4011ec81e4eeeeac1e6f4d1a780e7b"
                })
            })
        }
    ]
};

module.exports = {
    lambdaEvent
}