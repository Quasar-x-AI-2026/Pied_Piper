// Change this line
const budgetService = require('../services/budget-service'); 

// Remove the line: const budgetService = new BudgetService();

const createOrUpdateBudget = async (req, res) => {
    try {
        const userId = req.user.id;
        const budgetData = req.body;
        // The rest of your logic remains the same
        const result = await budgetService.createOrUpdateBudget(userId, budgetData);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to save budget', error: error.message });
    }
};

const getBudget = async (req, res) => {
    try {
        let userId = req.user?.id || req.user?._id || req.user;
        const budget = await budgetService.getByUserId(userId);
        
        return res.status(200).json({
            success: true,
            data: budget,
            message: 'Budget fetched successfully'
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch budget', error: error.message });
    }
};

module.exports = { 
    createOrUpdateBudget, 
    getBudget 
};