class StationNotFoundException extends Error {
    constructor(term){
        super(`station with name ${term} not found`)
        this.term = term;
    }
}

class NoStationAroundException extends Error {
    constructor(){
        super(`No station around you`) 
    }
}

module.exports = {
    StationNotFoundException,
    NoStationAroundException
}