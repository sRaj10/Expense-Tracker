const express = require('express')
const isLoggedIn = require('../middlewares/isLoggedIn')
const expenseModel = require('../models/expense-model')
const jwt = require('jsonwebtoken')
const router = express.Router()
const userModel = require('../models/user-model')
router.get('/',(req,res)=>{
    let error = req.flash('error');
    let success = req.flash('success')
    res.render('index',{error,success})
})

router.get('/expenses',isLoggedIn,async(req,res)=>{
    let error = req.flash('error')
    let decoded = jwt.verify(req.cookies.token,process.env.JWT_KEY)

    let user = await userModel.findOne({ email: decoded.email }).select("-password");
    let expenses = await expenseModel.find({ _id: { $in: user.expenses } });
     let success = req.flash('success')

    res.render('expenseTrack', { user: req.user, expenses , success });

    
}) 



router.post('/remove/:eId',async(req,res)=>{
    let decoded = jwt.verify(req.cookies.token,process.env.JWT_KEY)
    let user = await userModel.findOne({email: decoded.email}).select("-password")
    
    
    user.expenses.pull(req.params.eId)
    await user.save();
    
    req.flash("success",'removed ')
    res.redirect('/expenses')


})

router.get('/Allexpenses', async(req,res)=>{
    let decoded = jwt.verify(req.cookies.token,process.env.JWT_KEY)
    let user = await userModel.findOne({email: decoded.email}).select("-password")
    req.user = user  

    let expenses = await expenseModel.find({ _id: { $in: user.expenses } });
    res.render('expenseTrack',{expenses})

})

router.get('/aboutMe',(req,res)=>{
    res.render('aboutMe')
})












router.post('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('/')
})


module.exports = router;    