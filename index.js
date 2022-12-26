const express = require("express")

const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const app= express();
const PORT = 3000;

// const userLogsModel= require('./models/userLogsModels')


const cors = require('cors');
mongoose.set('strictQuery', false);


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

require('dotenv').config()
app.use("/userImages" , express.static("userImages"))
app.use("/admin_images" , express.static("admin_images"))
app.use("/currencyImages" , express.static("currencyImages"))



//connect to db
mongoose.connect(
    process.env.DB_CONNECTION, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => console.log("Connected to DB")
);

//middleware
app.use(express.json());



//routes
app.use("/admin" , require("./routes/adminRoute"))
app.use("/forgetPassword" , require("./routes/userForgetRoute"))
app.use("/privacyPolicy" , require("./routes/privacyPolicyRoute"))
app.use("/terms_conditions" , require("./routes/term&conditionRoute"))
app.use("/currency" , require("./routes/currencyRoute"))
app.use("/user" , require("./routes/userRoute"))
app.use("/trade" , require("./routes/tradeRoute"))
app.use("/take_profit" , require("./routes/takeProfitRoute"))
app.use("/stop_loss" , require("./routes/stopLossRoute"))
app.use("/productPrice" , require("./routes/productPriceRoute"))
app.use("/rank" , require("./routes/rankRoute"))
app.use("/bonus_plan" , require("./routes/bonusPlanRoute"))
app.use("/notification" , require("./routes/notificationRoute"))
app.use("/user_commission" , require("./routes/userCommissionRoute"))
app.use("/sales" , require("./routes/createSalesRoute"))



















//routes/logout routes
app.post("/user/logout",(req,res)=>
{
  const userId= req.body.userId;
  
  const userLog= new userLogsModel({
    _id:mongoose.Types.ObjectId(),
    user_id:userId,
    ip:req.body.ip,
    country:req.body.country,
    logType:"logout"
  })

  userLog.save(function(err,result){
    if(result){
      res.json({
        message: "user Logout record maintained",
        result:result,
        message: "after calling this api delete user jwt token stored in cookies ,local storage from front end"
      })
    }
    else{
      console.log("Error in saving logs")
    }
  })

 
})

// const cloudinary = require("./utils/cloudinary")




const server= app.listen(3000, function () {
    console.log("server started on port 3000")
})


