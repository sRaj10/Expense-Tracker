const express = require('express')
const app = express();
const index = require('./routes/index')
const path = require('path')
const userRouter = require('./routes/userRouter')
const expenseRouter = require('./routes/expenseRouter')
var flash = require('connect-flash')
require('dotenv').config()
var cookies = require("cookie-parser");
const cookieParser = require('cookie-parser')
const expressSession = require("express-session")



app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(flash())
app.use(cookies())
app.use(cookieParser())
app.use(
    expressSession({
        
        resave:false,
        saveUninitialized:false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
)

app.use('/',index)
app.use('/users',userRouter)
app.use('/expense',expenseRouter)


app.listen(3000,()=>{
    console.log("Listening on 3000  ")
})