const CrudRepository = require('./crud-repo');
const Budget = require('../models/budget');

class BudgetRepository extends CrudRepository {
    constructor() {
        super(Budget);
    }

    // Specialized method to find by UserID instead of _id
    async findByUserId(userId) {
        try {
            return await this.model.findOne({ userId });
        } catch (error) {
            console.log("Error in BudgetRepository: findByUserId", error);
            throw error;
        }
    }
}

module.exports = BudgetRepository;