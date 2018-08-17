const chai = require('chai');

const stationService = require('../sources/services/stations.service');
const stationEnum = require('../sources/models/stations.enum');
const stationExceptions = require('../sources/exceptions/stations.exception');

describe('V Lille test', async () => {
    it('search a station rihour', async () => {
        let station = await stationService.SearchStationIntent('rihour');
        chai.expect(station.name).to.equal(' Rihour ')
    })
    it('search a station that doesnt exist', async () => {
        try {
            let station = await stationService.SearchStationIntent('foo');
        }
        catch (ex) {
            chai.expect(ex).instanceOf(stationExceptions.StationNotFoundException);
        }
    })
    it('search station around a point', async () => {
        let stations = await stationService.getStationsLocation([50.63589, 3.062471], 500);
        chai.expect(stations.length).to.equal(10)
    })
    it('generation station image map', async () => {
        let station = await stationService.SearchStationIntent('rihour');
        let images = station.getMapImageStation();
    })
    it('search station around a point', async () => {
        let station = await stationService.NeablyStationIntent([50.63589, 3.062471]);
        //chai.expect(station.name).to.equal('13 Quai du Wault (CB)')
    })
})