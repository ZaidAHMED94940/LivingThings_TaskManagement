const express=require("express");
const app=express();
const {db}=require("./db")
const dotenv=require("dotenv");

const UserRoutes= require("./UserController/UserController");
const cors=require("cors")
app.use(cors())
app.use(express.json());
dotenv.config();
const port = process.env.PORT;
console.log(process.env.JWT_SECRET,"JWT SECRET")
  
app.use("/api/v1/user",UserRoutes)
app.listen(port,()=>{
    console.log(`Server is Listening :${port}`)
})