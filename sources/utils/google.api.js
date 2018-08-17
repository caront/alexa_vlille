const request = require('request');
const config = require('config')

async function GetGeoCoordonaite(address) {
    return new Promise(async (resolve, reject) => {
        try {
            let raw_address = `${address.addressLine1}+${address.city}+${address.postalCode}`;

            let option = {
                method: 'GET',
                url: 'https://maps.googleapis.com/maps/api/geocode/json',
                qs:
                {
                    address: raw_address,
                    key: config.google_map_api.api_key_geo
                }
            }
            request(option, function (error, response, body) {
                if (error)
                    return reject(error);

                if (response.statusCode == 200) {
                    let results = JSON.parse(body).results;
                    resolve(
                        [results[0].geometry.location.lat, results[0].geometry.location.lng]
                    )
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
    GetGeoCoordonaite
}