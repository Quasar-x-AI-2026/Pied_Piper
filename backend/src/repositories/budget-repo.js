const CrudRepository = require('./crud-repo');
const Budget = require('../models/budget');

class BudgetRepository extends CrudRepository {
    constructor() {
        super(Budget);
    }
}

module.exports = BudgetRepository;