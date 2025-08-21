import moment from 'moment';

export const validateEmail=(email)=>{
    const regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};

export const addThousandsSeperator=(num)=>{
    if(num ==null || isNaN(num)) return "";

    const [integerPart,fractionalPart]=num.toString().split(".");
const formattedInteger=integerPart.replace(/\B(?=(\d{3})+(?!\d))/g,",")
return fractionalPart 
? `${formattedInteger}.${fractionalPart}` 
: formattedInteger;
}

export const prepareExpenseBarChartData=(data=[])=>{
    const chartData=data.map((item)=>({
        category: item?.category,
        amount: item?.amount,
    }));
  return chartData;
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
