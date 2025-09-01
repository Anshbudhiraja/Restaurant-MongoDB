const mongoose = require("mongoose")

const BaseSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    businessName:{
        type:String,
        required:true
    }
},{timestamps:true})
const User = mongoose.model("users",BaseSchema)
module.exports=User