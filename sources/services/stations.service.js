const HTTP = require('./../utils/http.service');
const models = require('../models/stations.models');
const config = require('config');
const stationEnum = require('../models/stations.enum');
const exceptions = require('../exceptions/stations.exception');

const facets = ['libelle', 'nom', 'commune', 'etat', 'type', 'dist', 'etatconnexion'];


/**
 * Search for a station base on name
 * @param {string} name
 * @return {Station}
 */
async function getStationName(name) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await HTTP.GET(
                config.opendata.host,
                {
                    dataset: config.opendata.dataset,
                    q: name,
                    facet: facets
                });
            let response = JSON.parse(res);

            if (response.nhits == 0) {
                reject(new exceptions.StationNotFoundException(name))
            }
            else
                resolve(models.NewStationFromJson(
                    response.records[0].fields
                ))
        }
        catch (ex) {
            reject(ex);
        }
    })
}

/**
 * get all station on a range
 * @param {number[]} coor 
 * @param {number} dist 
 * @async
 * @return {station[]}
 */
async function getStationsLocation(coor, dist, start = 0, rows = 10, ) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await HTTP.GET(
                config.opendata.host,
                {
                    dataset: config.opendata.dataset,
                    sort: "-dist",
                    rows: rows,
                    start: start,
                    "geofilter.distance": `${coor[0]},${coor[1]},${dist}`,
                    facet: facets
                });
            let response = JSON.parse(res);

            if (response.nhits == 0) {
                reject(new exceptions.NoStationAroundException())
            }
            else
                resolve(response.records.map(
                    (raw) => {
                        return models.NewStationFromJson(raw.fields);
                    }
                ))
        }
        catch (ex) {
            reject(ex);
        }
    })
}

/**
 * Search for a station based on Name
 * @param {string} name
 * @async
 * @returns {station} 
 */
async function SearchStationIntent(name) {
    return new Promise(async (resolve, reject) => {
        try {
            let station = await getStationName(name);

            if (station.kind() == stationEnum.STATION || station.kind() == stationEnum.STATION_FULL)
                return resolve(station)


            //if station found is closed or empty, look for nearby stations
            let nearlyStations = await getStationsLocation(station.coor, 500, 1);

            for (let nearlyStationIdx in nearlyStations) {
                if (nearlyStations[nearlyStationIdx].kind() == stationEnum.STATION || nearlyStations[nearlyStationIdx].kind() == stationEnum.STATION_FULL) {
                    station.forward = nearlyStations[nearlyStationIdx]
                    break;
                }
            }
            resolve(station);
        }
        catch (ex) {
            reject(ex);
        }
    })
}

async function NeablyStationIntent(coor) {
    return new Promise(async (resolve, reject) => {
        try {
            let stations = await getStationsLocation(coor, 500);

            for (let stationIdx in stations) {
                if (stations[stationIdx].kind() == stationEnum.STATION || stations[stationIdx].kind() == stationEnum.STATION_FULL) {
                    return resolve(stations[stationIdx]);
                }
            }
            throw new exceptions.NoStationAroundException();
        }
        catch (ex) {
            reject(ex);
        }
    })
}


module.exports = {
    SearchStationIntent,
    getStationsLocation,
    NeablyStationIntent
}