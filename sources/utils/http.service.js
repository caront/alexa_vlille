const request = require("request");

async function GET(host, query, callback) {
    return new Promise((resolve, reject) => {
        let options = {
            url: host,
            qs: query
        };

        request(options, function (error, response, body) {
            if (error)
                return reject(new Error(error));
            resolve(body);
        });
    })

}



module.exports = {
    GET
}