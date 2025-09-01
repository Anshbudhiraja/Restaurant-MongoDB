const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const User = require("../Model/User")

const TokenChecker = async(req,resp,next) => {
   const token = req.header("Authorization")
   if(!token || !token.trim()) return resp.status(401).send({message:"Token Not found"})

   const {id} = jwt.verify(token,"Helloworld@123")
   if(!id || !mongoose.isValidObjectId(id)) return resp.status(401).send({message:"Invalid Token"})
  
   const existingUser = await User.findById(id).select("-password")
   if(!existingUser) return resp.status(401).send({message:"Invalid Token"})
   req.user = existingUser
   next()
} 
module.exports = TokenChecker