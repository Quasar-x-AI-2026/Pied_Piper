const  CrudRepository = require('./crud-repo');
const Scam = require('../models/scam');

class ScamRepository extends CrudRepository {
    constructor() {
        super(Scam);
    }
}

module.exports = ScamRepository;