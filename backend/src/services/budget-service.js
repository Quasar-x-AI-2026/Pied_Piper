const CrudService = require('./crud-service');
const BudgetRepository = require('../repositories/budget-repo');

class BudgetService extends CrudService {
    constructor() {
        const budgetRepository = new BudgetRepository();
        super(budgetRepository);
    }

    async getByUserId(userId) {
        return await this.repo.get({ userId });
    }

    async createOrUpdateBudget(userId, data) {
        const existing = await this.getByUserId(userId);
        if (existing) {
            return await this.update(existing._id, data);
        }
        return await this.create({ ...data, userId });
    }
}

// Exporting the INSTANCE
module.exports = new BudgetService();