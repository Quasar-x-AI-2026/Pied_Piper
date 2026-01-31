const ExpenseSerivce = require('../services/expense-service');
const expenseService = new ExpenseSerivce();

const createExpense = async (req, res) => {
    try {
         const data = req.body;
         const expense = await expenseService.create(data);
         res.status(201).json({
            data: expense,
            success: true,
            message: 'Expense created successfully',
            err: {}
         });    
    } catch (error) {
        console.log('Error in createExpense:', error);
        res.status(500).json({
            data: {},
            success: false,
            message: 'Internal server error',
            err: error
        });
    }
}

const createExpenseAi = async (req, res) => {
    try {
        const data = {
            message: req.body.message,
            userId: req.body.userId
        };
        const expense = await expenseService.createExpenseAi(data);
        res.status(201).json({
            data: expense,
            success: true,
            message: 'Expense created successfully using AI',
            err: {}
        });
    } catch (error) {
        console.log('Error in createExpenseAi:', error);
        res.status(500).json({
            data: {},
            success: false,
            message: 'Internal server error',
            err: error
        });
    }
}

const getExpenseByDate = async (req, res) => {
    try {
        const userId = req.params.userId;
        const date = req.params.date;
        const expenses = await expenseService.getExpenseByDate(userId, date);
        if (!expenses) {
            return res.status(404).json({
                data: {},
                success: false,
                message: 'No expenses found for the given date',
                err: {}
            });
        }
        res.status(200).json({
            data: expenses,
            success: true,
            message: 'Expenses fetched successfully',
            err: {}
        });
    } catch (error) {
        console.log('Error in getExpenseByDate:', error);
        res.status(500).json({
            data: {},
            success: false,
            message: 'Internal server error',
            err: error
        });
    }
}

module.exports = {
    createExpense,
    createExpenseAi,
    getExpenseByDate
};


