const express = require('express')
const router = express.Router();
const userModel = require('../models/user-model')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const expenseModel = require('../models/expense-model');




router.post('/register',async(req,res)=>{
    let {name,password,email}=req.body
    const user = await userModel.findOne({email:email})
    if(user)
    {
  
        res.status(401)
        req.flash('error','Account already created')
        res.redirect('/')
    }
    else{
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                let user = await userModel.create({
                    name,
                    email,
                    password:hash
                })
               const token = jwt.sign({
                email:user.email,
                id:user._id
                },process.env.JWT_KEY)
                res.cookie('token',token)
                req.flash('success','user created')
                res.redirect('/')
                
            });
        });
    }
})


router.post('/login',async (req,res)=>{
    let {email,password}=req.body
    let user = await userModel.findOne({email:email})
    if(!user)
    {
        res.status(404)
        req.flash('error','email or password incorrect')
        res.redirect('/')
    }
    else
    {
        bcrypt.compare(password, user.password, async function(err, result) {
          if(result)
          {
            const token = jwt.sign({
                email:user.email,
                id:user._id
                },process.env.JWT_KEY)
                res.cookie('token',token)
                let expenses = await expenseModel.find({ _id: { $in: user.expenses } });
                
                res.render('expenseTrack',{expenses})

                
          }
          else
          {
            res.status(403)
            req.flash('error','email or password incorrect')
            res.redirect('/')
          }
        });
    }
})




module.exports = router;
