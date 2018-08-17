const chai = require('chai');

const googleAPI = require('../sources/utils/google.api')

describe('google geo api test', async () => {

    it('try to request geocoordonate', async () => {
        let coor = await googleAPI.GetGeoCoordonaite({
            addressLine1: '25 rue de la baignerie',
            addressLine2: 'apt 6, etage 1',
            addressLine3: null,
            districtOrCounty: null,
            stateOrRegion: null,
            city: 'lille',
            countryCode: 'FR',
            postalCode: '59800'
        })

        console.log (coor)
    })
})