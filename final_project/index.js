const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const cors=require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
     if(req.session.token){
        return res.status(401).json("UnAuthorized Message");
     } 
     jwt.verify(req.session.token,"your_secret_key",(decoded,err)=>{
        if(err){
            return res.status(403).json({message:"Forbidden"});
        }
        req.user=decoded;
        next();
     })
});
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
