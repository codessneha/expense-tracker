import moment from 'moment';

export const validateEmail=(email)=>{
    const regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};

export const addThousandsSeperator = (num) => {
    if (num === null || num === undefined || isNaN(num)) return "0";
    if (num === 0) return "0";

    const [integerPart, fractionalPart] = num.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    return fractionalPart 
        ? `${formattedInteger}.${fractionalPart}` 
        : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
    try {
        console.log("Raw data into helper:", data);
        
        if (!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return [];
        }
        
        if (data.length === 0) {
            console.log('Empty data array provided');
            return [];
        }

        // Log all categories and amounts for debugging
        console.log('All categories and amounts:', data.map(item => ({
            category: item.category,
            amount: item.amount,
            categoryType: typeof item.category,
            amountType: typeof item.amount
        })));

        // Debug: Log the first item to check its structure
        const sampleItem = data[0];
        console.log('First data item structure:', {
            item: sampleItem,
            keys: sampleItem ? Object.keys(sampleItem) : 'No keys',
            hasCategory: sampleItem ? 'category' in sampleItem : false,
            hasAmount: sampleItem ? 'amount' in sampleItem : false,
            amountType: sampleItem?.amount ? typeof sampleItem.amount : 'N/A',
            categoryValue: sampleItem?.category ? sampleItem.category : 'N/A',
            categoryKeys: sampleItem?.category ? Object.keys(sampleItem.category) : 'No category keys'
        });

        // Check if data has the expected structure
        if (!sampleItem || !('category' in sampleItem) || !('amount' in sampleItem)) {
            console.error('Invalid data structure. Expected items with category and amount properties');
            return [];
        }

        // Group data by category and sum amounts
        const categoryMap = data.reduce((acc, item) => {
            if (!item) return acc;
            
            // Handle category as object with name property or as a string
            let categoryName = 'Uncategorized';
            if (item.category) {
                if (typeof item.category === 'object' && item.category !== null) {
                    categoryName = item.category.name || 'Uncategorized';
                } else if (typeof item.category === 'string') {
                    categoryName = item.category;
                }
            }
            
            // Convert amount to number and ensure it's positive
            const amount = Math.abs(parseFloat(item.amount) || 0);
            
            if (amount > 0) {
                acc[categoryName] = (acc[categoryName] || 0) + amount;
            }
            
            return acc;
        }, {});

        // Convert to array of { name, value } objects for the chart and sort by amount (descending)
        const result = Object.entries(categoryMap)
            .map(([name, value]) => ({
                name,
                value: parseFloat(value.toFixed(2))
            }))
            .sort((a, b) => b.value - a.value);
            
        console.log('Processed chart data result:', result);
        return result;
    } catch (error) {
        console.error('Error in prepareExpenseBarChartData:', error, 'Data:', data);
        return [];
    }
};


export const prepareIncomeBarChartData = (data) => {
    try {
        // Return empty array if data is not an array or is empty
        if (!Array.isArray(data) || data.length === 0) {
            return [];
        }
        
        // Filter out invalid items and create chart data
        const chartData = data
            .filter(item => item && item.date) // Ensure item exists and has a date
            .map(item => ({
                month: moment(item.date).isValid() ? moment(item.date).format("MMM") : 'N/A',
                amount: Number(item.amount) || 0,
                date: item.date // Keep original date for sorting
            }));
            
        // Sort by date
        return chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
        console.error('Error in prepareIncomeBarChartData:', error);
        return [];
    }
};

export const prepareExpenseLineChartData=(data=[])=>{
    const sortedData= [...data].sort((a,b)=>new Date(a.date)-new Date(b.date));
    const chartData=sortedData.map((item)=>({
        month: moment(item.date).format("MMM"),
        amount: item.amount,
        category: item.category,
    }));
    return chartData;
};
