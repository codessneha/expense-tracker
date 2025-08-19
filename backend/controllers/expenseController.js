const User=require("../models/User");
const Expense=require("../models/Expense");
const BsFiletypeXlsx=require("xlsx");


//add income source
exports.addExpense=async(req,res)=>{
    const userId=req.user.id;
    const {icon, category, date, amount}=req.body;
    //validation check
    if(!category || !amount || !date){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }

    const newExpense=new Expense({
        userId,
        icon,
        category,
        amount,
        date: new Date(date),
    });
    try {
        await newExpense.save();
        return res.status(200).json({
            success: true,
            message: "Expense added successfully",
            data: newExpense
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Expense addition failed",
            error: error.message
        });
    }
}


//get all income source
exports.getAllExpense=async(req,res)=>{
    const userId=req.user.id;
    try{
        const expense=await Expense.find({userId}).sort({date: -1});
        res.json(expense);
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Income deletion failed",
            error:error.message
        })
    }
};
//delete income source

exports.deleteExpense=async(req,res)=>{
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({
            success:true,
            message:"Expense deleted successfully"
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Income deletion failed",
            error:error.message
        })
    }
}

//download income source
exports.downloadExpenseExcel=async(req,res)=>{
    const userId=req.user.id;
    try{
        const expense=await Expense.find({userId}).sort({date: -1});
        //prepare data for excel
        const data=expense.map((item)=>({
            Category:item.category,
            Date:item.date,
            Amount:item.amount,
        }))
        const wb=BsFiletypeXlsx.utils.book_new();
        const ws=BsFiletypeXlsx.utils.json_to_sheet(data);
        BsFiletypeXlsx.utils.book_append_sheet(wb,ws,"Expense");
        BsFiletypeXlsx.writeFile(wb,"expense.xlsx");
        res.download("expense.xlsx");
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Income deletion failed",
            error:error.message
        })
    }
}

    
