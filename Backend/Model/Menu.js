const mongoose = require("mongoose")

const BaseSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"users"
    },
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    }
},{timestamps:true})
const Menu = mongoose.model("menus",BaseSchema)
module.exports = Menu