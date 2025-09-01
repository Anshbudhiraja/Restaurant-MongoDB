const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const User = require("../Model/User")
const bcrypt = require("bcrypt")

const TokenChecker = async(req,resp,next) => {
   const token = req.header("Authorization")
   if(!token || !token.trim()) return resp.status(401).send({message:"Unauthorized user"})

   const {id,rawToken} = jwt.verify(token,"Helloworld@123")
   if(!id || !mongoose.isValidObjectId(id) || !rawToken) return resp.status(401).send({message:"Unauthorized user"})
  
   const existingUser = await User.findById(id).select("-password")
   if(!existingUser) return resp.status(401).send({message:"Invalid Token"})
   if(!existingUser.token) return resp.status(401).send({message:"Unauthorized user"})

   const compare = await bcrypt.compare(rawToken,existingUser.token)
   if(!compare) return resp.status(401).send({message:"Unauthorized user"})
      
   req.user = existingUser
   next()
} 
module.exports = TokenChecker