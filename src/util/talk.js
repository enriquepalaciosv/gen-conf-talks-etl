function formatDay(day) {
    return [0, day].join("").slice(-2);
}

function cleanUri(uri) {
    if (uri) {
        uri = uri.replace(/\/study/gi, "");
        return uri.indexOf("?") > 0 ? uri.substring(0, uri.indexOf("?")) : uri;
    }
    return undefined;
}

function cleanAndConvertToHttps(uri) {
    if (uri) {
        let cleanUri =
            uri.indexOf("?") > 0 ? uri.substring(0, uri.indexOf("?")) : uri;

        cleanUri = cleanUri.replace(" ", "%20");

        return !cleanUri.includes("https")
            ? cleanUri.replace("http", "https")
            : cleanUri;
    }
    return uri;
}

function formatTitle(title) {
    return title.replace(/[“”]/g, "").replace("—", " ").replace(/[““””]/g, "");
}

function formatAuthor(author) {
    const formattedAuthor = author.replace(
        /Elder|President|Bishop|Prophet|Priest/gi,
        ""
    );
    return formattedAuthor.trim();
}

function createSynonym(title) {
    return title
        .replace(/[.,:…;?!']/g, "")
        .replace(/[—-—-]/g, " ")
        .replace(/[’]/g, "'")
        .replace(/[()]/g, "")
        .replace("[", "")
        .replace("]", "")
        .replace("D&C", "doctrines and covenants")
        .replace("“", "")
        .replace("”", "");
}


const getSession = (talkUri, manifest) => {
    const sessions = [];
    let sessionOrder = -1
    let sessionName;
    manifest.data.items[0].entries.forEach((mi) => {
        if (mi.entries) {
            sessions.push(mi);
        }
    });

    sessions.forEach((s, i) => {
        const exists = s.entries.find(e => e.uri === talkUri);
        if (exists) {
            sessionName = s.title;
            sessionOrder = i + 1;
        }
    });
    return { sessionOrder, sessionName };
};

const getTalkOrder = (talkUri, manifest) => {
    let talkOrder = -1
    manifest.data.items[0].entries.forEach((mi) => {
        if (mi.entries) {
            mi.entries.forEach((e, i) => {
                const exists = e.uri === talkUri;
                if (exists) {
                    talkOrder = i + 1;
                }
            });
        }
    });

    return talkOrder;
};

module.exports = {
    getSession, getTalkOrder, formatDay,
    cleanUri,
    cleanAndConvertToHttps,
    formatTitle,
    formatAuthor,
    createSynonym,
};