'use strict';
const Alexa = require('alexa-sdk');
const config = require('config');

const StationResponse = require('./sources/responses/stations.response');
const StationService = require('./sources/services/stations.service');
const StationModel = require('./sources/models/stations.models');
const StationException = require('./sources/exceptions/stations.exception');

const AmazonException = require('./sources/utils/amazon.exception');
const AmazonAPI = require('./sources/utils/amazon.api');

const GoogleApi = require('./sources/utils/google.api');


const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', "bonjour et bienvenue sur v lille, quelle station de v lille voulez-vous ?");
    },
    'SearchStationIntent': async function () {
        try {
            let stationName = this.event.request.intent.slots.station.value;
            let station = await StationService.SearchStationIntent(stationName);

            console.log('SearchStationIntent', stationName, station);

            this.emit(':tellWithCard',
                await StationResponse.SearchStationIntentResponse(station),
                station.name,
                await StationResponse.SearchStationIntentResponseCard(station),
                station.getMapImageStation()
            );
        }
        catch (ex) {
            console.log('SearchStationIntent', ex);
            if (ex instanceof StationException.StationNotFoundException) {
                this.emit(':tell', `Je n'ai pas trouvé la station ${ex.term}.`)
            }
            else {
                this.emit(':tell', "Je ne sais pas");
            }
        }
    },
    'NeablyStationIntent': async function () {
        let deviceId = this.event.context.System.device.deviceId;
        let apiAccessToken = this.event.context.System.apiAccessToken;
        let apiEndpoint = this.event.context.System.apiEndpoint;

        try {
            let address = await AmazonAPI.GetUserAdress(deviceId, apiEndpoint, apiAccessToken);
            let coor = await GoogleApi.GetGeoCoordonaite(address);

            let station = await StationService.NeablyStationIntent(coor);

            console.log('NeablyStationIntent', station);

            this.emit(':tellWithCard',
                await StationResponse.NeablyStationIntentResponse(station),
                station.name,
                await StationResponse.NeablyStationIntentResponse(station),
                station.getMapImageStation()
            );
        }
        catch (ex) {
            console.log('NeablyStationIntent', ex);
            if (ex instanceof AmazonException.NotAllow) {
                this.emit(':tell', "Vous n'avez pas autorisé la skill v lille à utiliser votre localisation.");
            }
            else if (ex instanceof StationException.NoStationAroundException) {
                this.emit(':tell', "Je n'ai pas trouvé de station disponibles dans un rayon de 500 métres.");
            }
            else {
                this.emit(':tell', "Je ne sais pas");
            }
        }

    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'Je peux vous trouver des stations de V Lille autour de vous et vous dire combien de vélo sont disponible. Il vous suffit de dire : "Alexa, demande à vélo Lille la station la plus proche", ou encore "Alexa, demande à vélo Lille la station république". Vous pouvez me demander dès à présent quelle station de V Lille vous voulez.');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', '');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', '');
    },
    'Unhandled': function () {
        this.emit(':tell', '');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = config.alexa.app_id;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
