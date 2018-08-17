class NotAllow extends Error {
    constructor() {
        super('user has not allow your skill');
    }
}



module.exports = {
    NotAllow
}