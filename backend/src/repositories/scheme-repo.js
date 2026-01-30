const CrudRepository = require('./crud-repo');
const Scheme = require('../models/scheme')

class SchemeRepository extends CrudRepository {
    constructor() {
        super(Scheme);
    }
}

module.exports = SchemeRepository;