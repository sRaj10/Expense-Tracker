const express = require('express')
const router = express.Router();
const expenseModel = require('../models/expense-model')
const userModel = require('../models/user-model')
const jwt = require('jsonwebtoken')


router.post('/new',async(req,res)=>{
    let decoded = jwt.verify(req.cookies.token,process.env.JWT_KEY)
    let user = await userModel.findOne({email: decoded.email}).select("-password")
    req.user = user
    
    let{date,description,amount,type}= req.body

    let addedExpense = await expenseModel.create({
        date,description,amount,type
    })
    user.expenses.push(addedExpense._id)
    await user.save()
    req.flash('success','Added')
    let success = req.flash('success')

    let expenses = await expenseModel.find({ _id: { $in: user.expenses } });
  
    res.redirect('/expenses');

})
const monthMapping = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12
};
router.post('/filter', async (req, res) => {
    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel.findOne({ email: decoded.email }).select("-password");
        req.user = user;

        let { month } = req.body; 
        let monthNumber = monthMapping[month.toLowerCase()];

        if (!monthNumber) {
            req.flash('error', 'Invalid month selected');
            return res.redirect('/expenses');
        }

        let expenses = await expenseModel.find({ _id: { $in: user.expenses } });

        let filteredExpenses = expenses.filter(expense => {
            let expenseMonth = new Date(expense.date).getMonth() + 1;
            return expenseMonth === monthNumber;
        });
   
        
        res.render('expenseTrack', { user: req.user, expenses: filteredExpenses, month  });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong');
        res.redirect('/expenses');
    }
});





module.exports = router;
