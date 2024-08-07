const mongoose = require('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/expense-tracker');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        minLength:2
    },
    email:{
        type:String
    },
    password:{
        type:String,
    },
    expenses:{
        type:[mongoose.Schema.Types.ObjectId],ref:'expense',default:[]
    },
   
})


module.exports= mongoose.model('user',userSchema)