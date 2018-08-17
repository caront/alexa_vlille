const request = require('request');
const exception = require('./amazon.exception');

async function GetUserAdress(deviceId, apiEndPoint, apiAccessToken) {
    return new Promise(async (resolve, reject) => {
        try {
            let option = {
                method: 'GET',
                url: `${apiEndPoint}/v1/devices/${deviceId}/settings/address`,
                headers:
                {
                    Authorization: `Bearer ${apiAccessToken}`
                }
            }


            request(option, function (error, response, body) {
                if (error)
                    return reject(error);

                if (response.statusCode == 200) {
                    resolve(
                        JSON.parse(body)
                    )
                }
                else if (response.statusCode == 403) {
                    reject(new exception.NotAllow())
                }
                else
                    reject({ code: response.statusCode });
            })
        }
        catch (ex) {
            reject(ex);
        }
    })

}


module.exports = {
    GetUserAdress
}