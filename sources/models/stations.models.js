const config = require('config');
const querystring = require('querystring');

const stationEnum = require('./stations.enum')



class Station {
    constructor(name, nbrBike, nbrPlace, coor, address, state, tpe) {
        this.name = name;
        this.nbrBike = nbrBike;
        this.nbrPlace = nbrPlace;
        this.coor = coor;
        this.address = address;
        this.state = state;
        this.tpe = tpe == 'AVEC TPE'

        this.forward = null
    }

    getMapImageStation() {
        if (this.kind == stationEnum.STATION_NOT_FOUND) {
            return {
                smallImageUrl: "",
                largeImageUrl: ""
            }
        }
        let smallImageProperty = {
            key: config.google_map_api.api_key,
            center: `${this.coor[0]},${this.coor[1]}`,
            zoom: 19,
            size: "720x480",
            maptype: "roadmap",
            //markers: `color:blue|${station.coor[0]},${station.coor[1]}`
        }
        let largeImageProperty = {
            key: config.google_map_api.api_key,
            center: `${this.coor[0]},${this.coor[1]}`,
            zoom: 18,
            size: "1200x800",
            maptype: "roadmap",
            //markers: `color:red|50.63589,3.062471`

        }
        return {
            smallImageUrl: `${config.google_map_api.end_point}?${querystring.stringify(smallImageProperty)}`,
            largeImageUrl: `${config.google_map_api.end_point}?${querystring.stringify(largeImageProperty)}`
        }
    }

    kind() {
        return this.nbrBike == 0 ? stationEnum.STATION_EMPTY
            : this.nbrBike == this.nbrPlace ? stationEnum.STATION_FULL
                : stationEnum.STATION
    }
}

function NewStationFromJson(json) {
    let name = json.nom.match(/[^0-9].*[^(CB)]/g)[0];
    return new Station(name, json.nbvelosdispo, json.nbplacesdispo, json.geo, json.adresse, json.etat, json.type)
}


module.exports = {
    NewStationFromJson,
    Station
}