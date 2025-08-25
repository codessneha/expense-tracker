import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { API_PATH } from '../../utils/apipath';
import { useNavigate } from 'react-router-dom';
import InfoCard from '../../components/cards/infoCards';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';
import axiosInstance from '../../utils/axiosInstance';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from '../../components/Dashboard/last30DaysExpenses';
import { addThousandsSeperator } from '../../utils/helper';
import RecentIncome from '../../components/Dashboard/RecentIncome';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';

const Home = () => {
    useUserAuth();
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        if (loading) return;
        setLoading(true);
        console.log('Fetching dashboard data...');
        try {
            console.log('Fetching dashboard data from:', API_PATH.DASHBOARD.GET_DATA);
            const response = await axiosInstance.get(API_PATH.DASHBOARD.GET_DATA);
            console.log('Dashboard API Response Status:', response.status, response.statusText);
            
            if (response && response.data) {
                console.log('Last 60 Days Income Data Structure:', {
                    hasLast60DaysIncome: !!response.data?.data?.last60DaysIncome,
                    isArray: Array.isArray(response.data?.data?.last60DaysIncome),
                    keys: response.data?.data?.last60DaysIncome ? Object.keys(response.data.data.last60DaysIncome) : 'N/A',
                    transactionsType: Array.isArray(response.data?.data?.last60DaysIncome?.transactions) ? 'array' : typeof response.data?.data?.last60DaysIncome?.transactions,
                    transactionsLength: Array.isArray(response.data?.data?.last60DaysIncome?.transactions) ? response.data.data.last60DaysIncome.transactions.length : 'N/A',
                    sampleTransaction: response.data?.data?.last60DaysIncome?.transactions?.[0] || 'No transactions found'
                });
                
                console.log('Recent Transactions Data:', response.data?.data?.recentTransactions);
                console.log('Last 30 Days Expenses:', response.data?.data?.last30DaysExpenses);
                console.log('Last 60 Days Income:', response.data?.data?.last60DaysIncome);
                console.log('Full dashboard data structure:', JSON.stringify(response.data, null, 2));
                console.log('Total Balance from API:', response.data?.data?.totalBalance);
                console.log('Total Income from API:', response.data?.data?.totalIncome);
                console.log('Total Expense from API:', response.data?.data?.totalExpense);
                console.log('Dashboard Data:', response.data);
                
                setDashboardData(response.data);
                setError(null); // Clear any previous errors
            } else {
                console.warn('No data in dashboard response');
                setDashboardData(null);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        
        // Add event listener for dashboard data refresh
        const handleDashboardChange = () => {
            fetchDashboardData();
        };
        
        window.addEventListener('dashboard-data-changed', handleDashboardChange);
        
        // Cleanup
        return () => {
            window.removeEventListener('dashboard-data-changed', handleDashboardChange);
        };
    }, []);

    // Debug logging - moved outside JSX return
    const incomeData = dashboardData?.data?.last60DaysIncome;
    console.log('Dashboard data structure:', {
        hasData: !!dashboardData?.data,
        hasLast60DaysIncome: !!dashboardData?.data?.last60DaysIncome,
        incomeCount: Array.isArray(dashboardData?.data?.last60DaysIncome?.transactions) 
            ? dashboardData.data.last60DaysIncome.transactions.length 
            : 0,
        expenseCount: Array.isArray(dashboardData?.data?.last30DaysExpenses?.transactions)
            ? dashboardData.data.last30DaysExpenses.transactions.length
            : 0
    });

    console.log('Dashboard data structure:', {
        hasData: !!dashboardData?.data,
        hasIncomeData: !!incomeData,
        incomeDataStructure: incomeData,
        incomeTransactions: incomeData?.transactions || [],
        incomeTransactionsCount: incomeData?.transactions?.length || 0,
        incomeDataKeys: incomeData ? Object.keys(incomeData) : [],
        firstIncomeTransaction: incomeData?.transactions?.[0] || 'No transactions'
    });

    console.log('Income transactions data:', {
        hasData: Array.isArray(dashboardData?.data?.last60DaysIncome?.transactions) && dashboardData.data.last60DaysIncome.transactions.length > 0,
        count: Array.isArray(dashboardData?.data?.last60DaysIncome?.transactions) ? dashboardData.data.last60DaysIncome.transactions.length : 0,
        sample: dashboardData?.data?.last60DaysIncome?.transactions?.[0],
        sampleKeys: dashboardData?.data?.last60DaysIncome?.transactions?.[0] ? Object.keys(dashboardData.data.last60DaysIncome.transactions[0]) : []
    });

    // Loading state
    if (loading && !dashboardData) {
        return (
            <DashboardLayout activeMenu="Dashboard">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard data...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Error state
    if (error && !dashboardData) {
        return (
            <DashboardLayout activeMenu="Dashboard">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error loading dashboard data: {error}</p>
                        <button 
                            onClick={fetchDashboardData}
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div>
                <div className="my-5 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InfoCard
                            icon={<IoMdCard />}
                            label="Total Balance"
                            value={dashboardData?.data?.totalBalance ?? 0}
                            color="bg-primary"
                        />
                        <InfoCard
                            icon={<LuWalletMinimal />}
                            label="Total Income"
                            value={dashboardData?.data?.totalIncome ?? 0}
                            color="bg-orange-500"
                        />
                        <InfoCard
                            icon={<LuHandCoins />}
                            label="Total Expense"
                            value={dashboardData?.data?.totalExpense ?? 0}
                            color="bg-red-500"
                        />
                    </div>
                </div>

                {/* Row 1: Recent Transactions and Finance Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Left: Recent Transactions */}
                    <div className="lg:col-span-1">
                        <RecentTransactions
                            transactions={dashboardData?.data?.recentTransactions || []}
                            onSeeMore={() => navigate("/expense")}
                        />
                    </div>

                    {/* Right: Finance Overview */}
                    <div className="lg:col-span-1">
                        <FinanceOverview
                            totalBalance={dashboardData?.data?.totalBalance || 0}
                            totalIncome={dashboardData?.data?.totalIncome || 0}
                            totalExpense={dashboardData?.data?.totalExpense || 0}
                        />
                    </div>
                </div>

                {/* Row 2: Expenses and Last 30 Days Expenses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Left: Expense Transactions */}
                    <div className="lg:col-span-1">
                        <ExpenseTransactions
                            transactions={dashboardData?.data?.recentTransactions?.filter(t => t.type === 'expense') || []}
                            onSeeMore={() => navigate("/expense")}
                        />
                    </div>

                    {/* Right: Last 30 Days Expenses Chart */}
                    <div className="lg:col-span-1">
                        <div className="card h-full flex flex-col">
                            <h3 className="text-lg font-medium mb-4">Last 30 Days Expenses</h3>
                            <div className="flex-1 min-h-0">
                                {console.log('Last30DaysExpenses data:', {
                                    hasData: !!dashboardData?.data?.last30DaysExpenses,
                                    isArray: Array.isArray(dashboardData?.data?.last30DaysExpenses?.transactions),
                                    dataLength: dashboardData?.data?.last30DaysExpenses?.transactions?.length || 0,
                                    allItems: dashboardData?.data?.last30DaysExpenses?.transactions || [],
                                    medicalExpense: dashboardData?.data?.last30DaysExpenses?.transactions?.filter(t => 
                                        t.category?.name?.toLowerCase().includes('med') || 
                                        t.category?.toLowerCase().includes('med')
                                    ) || []
                                })}
                                <div className="w-full h-full">
                                    <Last30DaysExpenses
                                        data={dashboardData?.data?.last30DaysExpenses?.transactions || []}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3: Income and Last 60 Days Income */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Recent Income */}
                    <div className="lg:col-span-1">
                        <RecentIncome
                            transactions={Array.isArray(dashboardData?.data?.recentTransactions) 
                                ? dashboardData.data.recentTransactions
                                    .filter(tx => tx.type === 'income')
                                    .map(tx => ({
                                        ...tx,
                                        // Ensure we have the expected fields
                                        incomeSource: tx.incomeSource || tx.source || 'Other',
                                        date: tx.date || new Date(),
                                        amount: tx.amount || 0,
                                        type: 'income'
                                    }))
                                    .slice(0, 5) // Limit to 5 most recent
                                : []}
                            onSeeMore={() => navigate('/transactions/income')}
                        />
                    </div>

                    {/* Right: Last 60 Days Income Chart */}
                    <div className="lg:col-span-1">
                        <div className="card">
                            <h3 className="text-lg font-medium mb-4">Last 60 Days Income</h3>
                            <div className="h-64">
                                {console.log('Dashboard data for income chart:', {
                                    hasLast60DaysIncome: !!dashboardData?.data?.last60DaysIncome,
                                    transactions: dashboardData?.data?.last60DaysIncome?.transactions,
                                    total: dashboardData?.data?.last60DaysIncome?.total,
                                    dataStructure: dashboardData?.data?.last60DaysIncome
                                })}
                                <RecentIncomeWithChart
                                    data={dashboardData?.data?.last60DaysIncome?.transactions || []}
                                    totalIncome={dashboardData?.data?.last60DaysIncome?.total || 0}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Home;