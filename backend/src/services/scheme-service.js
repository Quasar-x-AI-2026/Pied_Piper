const CrudService = require('./crud-service');  
const SchemeRepository = require('../repositories/scheme-repo');

class SchemeService extends CrudService {
    constructor() { 
        const schemeRepository = new SchemeRepository();
        super(schemeRepository);
    }
}

module.exports = SchemeService;