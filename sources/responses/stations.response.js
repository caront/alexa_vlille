const stationEnum = require('../models/stations.enum');
const stationModel = require('../models/stations.models');

async function SearchStationIntentResponse(station) {
    return new Promise(async (resolve, reject) => {
        try {
            switch (station.kind()) {
                case (stationEnum.STATION_NOT_FOUND):
                    resolve(`Je n'ai pas trouvé la station ${station.name}.`);
                    break;
                case (stationEnum.STATION):
                    resolve(`Il y a actuellement ${station.nbrBike} vélo${station.nbrBike != 1 ? 's' : ''} à la station ${station.name}.`);
                    break;
                case (stationEnum.STATION_CLOSED):
                    if (station.forward == null)
                        resolve(`Désoler, mais la station ${station.name} est fermé. Et je n'ai trouvé aucune autre station disponible dans un rayon de 500 mètres de cette station.`)
                    else
                        resolve(`Désoler, mais la station ${station.name} est fermé. Néanmoins, la station la plus proche est ${station.forward.name}, elle dispose de ${station.forward.nbrBike} vélo${station.forward.nbrBike != 1 ? 's' : ''}.`);
                    break;
                case (stationEnum.STATION_EMPTY):
                    if (station.forward == null)
                        resolve(`Désoler, mais la station ${station.name} est vide. Et je n'ai trouvé aucune autre station disponible dans un rayon de 500 mètres de cette station.`)
                    else
                        resolve(`Désoler, mais la station ${station.name} est vide. Néanmoins, la station la plus proche est ${station.forward.name}, elle dispose de ${station.forward.nbrBike} vélo${station.forward.nbrBike != 1 ? 's' : ''}.`);
                    break;
                case (stationEnum.STATION_FULL):
                    resolve(`La station ${station.name} est pleine, il y a actuellement ${station.nbrBike} vélo${station.nbrBike != 1 ? 's' : ''}.`);
                    break;
                default:
                    resolve(`Je n'ai pas trouvé la station ${station.name}.`);
                    break;
            }
        }
        catch (ex) {
            reject(ex);
        }
    })
}


async function SearchStationIntentResponseCard(station) {
    return new Promise(async (resolve, reject) => {
        try {
            switch (station.kind()) {
                case (stationEnum.STATION_NOT_FOUND):
                    resolve(`Je n'ai pas trouvé la station ${station.name}.`);
                    break;
                case (stationEnum.STATION):
                    resolve(`Il y a actuellement ${station.nbrBike} vélo${station.nbrBike != 1 ? 's' : ''} à la station ${station.name}.`);
                    break;
                case (stationEnum.STATION_CLOSED):
                    if (station.forward.kind == stationEnum.STATION_NOT_FOUND)
                        resolve(`Désoler, mais la station ${station.name} est fermé. Et je n'ai trouvé aucune autre station disponible dans un rayon de 500 mètres de cette station.`)
                    else
                        resolve(`Désoler, mais la station ${station.name} est fermé. Néanmoins, la station la plus proche est ${station.forward.name}, elle dispose de ${station.forward.nbrBike} vélo${station.forward.nbrBike != 1 ? 's' : ''}.`);
                    break;
                case (stationEnum.STATION_EMPTY):
                    if (station.forward.kind == stationEnum.STATION_NOT_FOUND)
                        resolve(`Désoler, mais la station ${station.name} est vide. Et je n'ai trouvé aucune autre station disponible dans un rayon de 500 mètres de cette station.`)
                    else
                        resolve(`Désoler, mais la station ${station.name} est vide. Néanmoins, la station la plus proche est ${station.forward.name}, elle dispose de ${station.forward.nbrBike} vélo${station.forward.nbrBike != 1 ? 's' : ''}.`);
                    break;
                case (stationEnum.STATION_FULL):
                    resolve(`La station ${station.name} est pleine, il y a actuellement ${station.nbrBike} vélo${station.nbrBike != 1 ? 's' : ''}.`);
                    break;
                default:
                    resolve(`Je n'ai pas trouvé la station ${station.name}.`);
                    break;
            }
        }
        catch (ex) {
            reject(ex);
        }
    })
}


async function NeablyStationIntentResponse(station) {
    return new Promise(async (resolve, reject) => {
        try {
            switch (station.kind()) {
                case (stationEnum.STATION_NOT_FOUND):
                    resolve(`Je n'ai pas trouvé de station prés de vous`);
                    break;
                case (stationEnum.STATION):
                    resolve(`La station de v Lille la plus proche est à la station ${station.name}. Elle est situé ${station.address} et il y a actuellement ${station.nbrBike} vélo${station.nbrBike != 1 ? 's' : ''} disponible${station.nbrBike != 1 ? 's' : ''}`);
                    break;
                case (stationEnum.STATION_FULL):
                    resolve(`La station de v Lille la plus proche est à la station ${station.name}. Elle est situé ${station.address} et il y a actuellement ${station.nbrBike} vélo${station.nbrBike != 1 ? 's' : ''} disponible${station.nbrBike != 1 ? 's' : ''}`);
                    break;
                default:
                    resolve(`Je n'ai pas trouvé de station prés de vous`);
                    break;
            }
        }
        catch (ex) {
            reject(ex);
        }
    })
}

module.exports = {
    SearchStationIntentResponse,
    SearchStationIntentResponseCard,
    NeablyStationIntentResponse
}


