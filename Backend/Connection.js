const mongoose = require("mongoose")
const Connection = async() => {
    try {
        await mongoose.connect("mongodb://localhost:27017/Amazon")
        console.log("Connected to Mongodb")
    } catch (error) {
        console.log("Error Occured in connecting mongodb")
    }
}
module.exports = Connection