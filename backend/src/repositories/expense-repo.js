const CrudRepository = require('./crud-repo');
const Expense = require('../models/expense');

class ExpenseRepository extends CrudRepository {
    constructor() { 
        super(Expense);
    }
}

module.exports = ExpenseRepository;