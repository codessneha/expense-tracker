const { Types } = require('mongoose');
const Income = require("../models/Income");
const Expense = require("../models/Expense");

// Get dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        // Fetch total income
        const totalIncomeResult = await Income.aggregate([
            {
                $match: { userId: userObjectId }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Fetch total expenses
        const totalExpensesResult = await Expense.aggregate([
            {
                $match: { userId: userObjectId }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Get income transactions in the last 60 days
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        
        const last60DaysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: sixtyDaysAgo }
        }).sort({ date: -1 });

        // Calculate total income for last 60 days
        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        // Get expense transactions in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const last30DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: thirtyDaysAgo }
        }).sort({ date: -1 });

        // Calculate total expenses for last 30 days
        const expenseLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        // Fetch recent transactions (5 most recent from both income and expense)
        const recentIncomes = await Income.find({ userId: userObjectId })
            .sort({ date: -1 })
            .limit(5)
            .lean();
            
        const recentExpenses = await Expense.find({ userId: userObjectId })
            .sort({ date: -1 })
            .limit(5)
            .lean();

        const lastTransactions = [
            ...recentIncomes.map(txn => ({ ...txn, type: "income" })),
            ...recentExpenses.map(txn => ({ ...txn, type: "expense" }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date))
         .slice(0, 10); // Limit to 10 most recent transactions

        // Final response
        res.json({
            success: true,
            data: {
                totalBalance: (totalIncomeResult[0]?.total || 0) - (totalExpensesResult[0]?.total || 0),
                totalIncome: totalIncomeResult[0]?.total || 0,
                totalExpense: totalExpensesResult[0]?.total || 0,
                last30DaysExpenses: {
                    total: expenseLast30Days,
                    transactions: last30DaysExpenseTransactions
                },
                last60DaysIncome: {
                    total: incomeLast60Days,
                    transactions: last60DaysIncomeTransactions
                },
                recentTransactions: lastTransactions,
            }
        });
        
    } catch (error) {
        console.error('Dashboard error:', error);
        return res.status(500).json({
            success: false,
            message: "Dashboard data fetching failed",
            error: error.message
        });
    }
};