const User=require("../models/User");
const Income=require("../models/Income");
const BsFiletypeXlsx=require("xlsx");


//add income source
exports.addIncome=async(req,res)=>{
    const userId=req.user.id;
    const {icon,source,date,amount}=req.body;
    //validation check
    if(!icon || !source || !date || !amount){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }

    const newIncome=new Income({
        userId,
        icon,
        source,
        date,
        amount: Number(amount),
    });
    try {
        await newIncome.save();
        return res.status(200).json({
            success: true,
            message: "Income added successfully",
            data: newIncome
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Income addition failed",
            error: error.message
        });
    }
}


//get all income source
exports.getAllIncome=async(req,res)=>{
    const userId=req.user.id;
    try{
        const income=await Income.find({userId}).sort({date: -1});
        res.json(income);
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

exports.deleteIncome=async(req,res)=>{
    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({
            success:true,
            message:"Income deleted successfully"
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
exports.downloadIncomeExcel=async(req,res)=>{
    const userId=req.user.id;
    try{
        const income=await Income.find({userId}).sort({date: -1});
        //prepare data for excel
        const data=income.map((item)=>({
            Source:item.source,
            Date:item.date,
            Amount:item.amount,
        }))
        const wb=BsFiletypeXlsx.utils.book_new();
        const ws=BsFiletypeXlsx.utils.json_to_sheet(data);
        BsFiletypeXlsx.utils.book_append_sheet(wb,ws,"Income");
        BsFiletypeXlsx.writeFile(wb,"income.xlsx");
        res.download("income.xlsx");
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Income deletion failed",
            error:error.message
        })
    }
}

    
