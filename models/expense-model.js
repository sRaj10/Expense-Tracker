
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/expense-tracker');

const expenseSchema = mongoose.Schema({
    amount:{
        type:Number
    },
    date:{
        type:Date,
        
    },
    description:{
        type:String
    },
    type:{
        type:String
    }
})

module.exports = mongoose.model('expense',expenseSchema)