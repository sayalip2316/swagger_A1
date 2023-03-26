const express=require("express")
const userRouter=express.Router()
const {UserModel}=require("../model/user.model")
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt")

//registration
userRouter.post("/register",async(req,res)=>{
   const {email,password,location,age}=req.body
   try {
    bcrypt.hash(password,5,async(err,hash)=>{
        if(err){
            res.status(500).send("something went wrong")
        }
        if(hash){
            const user=new UserModel({email,password:hash,location,age})
            await user.save()
            res.status(400).send({"msg":"Registration has been done"})
        }
    });
   } catch (error) {
    res.status(400).send({"msg":error.message})
   }
})

//login

userRouter.post("/login",async(req,res)=>{
const {email,password}=req.body
try {
    const user=await UserModel.findOne({email})
    if(user){
        bcrypt.compare(password,user.password,async(err,result)=>{
            if(result){
                res.status(200).send({"msg":"Login successfull","token":jwt.sign({"userID":user._id},"masai")})
            }else{
                res.status(400).send({"msg":"Wrong credentials"})
            }
        });
    }
} catch (error) {
    res.status(400).send({"msg":error.message})
}
})


module.exports={userRouter}
