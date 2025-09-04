const mongoose = require("mongoose")
const express = require("express")
const jwt = require('jsonwebtoken');
const multer = require("multer")
const fs = require("fs")
const cors = require("cors");
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const Connection = require("./Connection")
const TokenChecker = require("./utils/TokenChecker")
const User = require("./Model/User")
const Menu = require("./Model/Menu");
const app = express()
const PORT = 3010
app.use(express.json({limit:"100kb"}))
app.use(cors())
app.use("/uploads",express.static("uploads"))
Connection()

app.post("/createUser",async(req,resp)=>{
    try {
     const {name,phone,email,password,businessName} = req.body
     if(!name || !phone || !email || !password || !businessName || !name.trim() || !phone.trim() || !email.trim() || !password.trim() || !businessName.trim()) return resp.status(400).send({message:"Field are required"})  

     const existingUser = await User.findOne({email:email?.trim()?.toLowerCase()})
     if(existingUser) return resp.status(405).send({message:"Account related to this email already exists"})

     const salt = await bcrypt.genSalt(10)
     const hashpassword= await bcrypt.hash(password,salt)
     const newUser = new User({name,phone,email:email?.trim()?.toLowerCase(),password:hashpassword,businessName})
     await newUser.save()
     return resp.status(201).send({message:"Account created successfully",data:newUser})

    } catch (error) {
        return resp.status(500).send({message:"Internal Server Error",error})
    }
})

app.post("/verifyUser",async(req,resp)=>{
    try {
     const {email,password} = req.body
     if(!email || !password || !email.trim() || !password.trim()) return resp.status(400).send({message:"Field are required"})  

     const existingUser = await User.findOne({email:email?.trim()?.toLowerCase()})
     if(!existingUser) return resp.status(404).send({message:"Invalid Credentials"})
     const compare = await bcrypt.compare(password,existingUser.password)
     if(!compare) return resp.status(400).send({message:"Invalid Credentials"})
    
     const rawToken= crypto.randomBytes(8).toString('hex')
     const salt = await bcrypt.genSalt(10)
     const hashedToken = await bcrypt.hash(rawToken,salt)
     existingUser.token = hashedToken
     await existingUser.save()
    
     const payload = {id:existingUser._id,rawToken}
     const token = jwt.sign(payload,"Helloworld@123")
     return resp.status(202).send({message:"Login Successfully",token})
    } catch (error) {
        return resp.status(500).send({message:"Internal Server Error",error})
    }
})

app.post("/logout",TokenChecker,async(req,resp)=>{
    try {
       await User.findByIdAndUpdate(req.user._id,{token:null},{new:true,runValidators:true})
       return resp.status(202).send({message:"Logged out"})
    } catch (error) {
        return resp.status(500).send({message:"Internal Server Error",error})
    }
})

app.get("/getUser",TokenChecker,async(req,resp)=>{
  const {name,phone,email,businessName} = req.user
  return resp.status(202).send({message:"Fetched successfully",data:{name,phone,email,businessName}})
})


const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
      fs.mkdir("./uploads",{recursive:true},(err)=>{
          if(err) return cb(err,null)
          else cb(null, "./uploads");
      })
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({storage:storage1})


app.post("/createMenu",TokenChecker,upload.single("image"),async(req,resp)=>{
    const file = req.file?"uploads/"+req.file.filename:null
    try {
        const {name,price,category} = req.body
        if(!name || !price || !category || !name.trim() || !price.trim() || !category.trim()) {
            if(file){
                const data = await deleteImage(file)
                if(!data.status) return resp.status(400).send({message:"Failed to delete the image"})
            }
            return resp.status(400).send({message:"Fields are required"})
        }
        if(!Number(price)) {
            if(file){
                const data = await deleteImage(file)
                if(!data.status) return resp.status(400).send({message:"Failed to delete the image"})
            }
            return resp.status(400).send({message:"Invalid price"})
        }
        if(!file) {
            return resp.status(400).send({message:"Menu Image is required"})
        }
        
        const updatedName = name.trim().slice(0,1).toUpperCase() + name.trim().slice(1).toLowerCase()
        const updatedCategory = category.trim().toLowerCase()

        const existingMenu = await Menu.findOne({name:updatedName,category:updatedCategory,userId:req.user._id})
        if(existingMenu) return resp.status(405).send({message:"This menu already exists with this name."})
        
        const newMenu = new Menu({name:updatedName,category:updatedCategory,price:Number(price).toFixed(2),image:file,userId:req.user._id})
        await newMenu.save()
        return resp.status(201).send({message:"Menu addded successfully"})
    } catch (error) {
        if(file){
            const data = await deleteImage(file)
            if(!data.status) return resp.status(400).send({message:"Failed to delete the image"})
        }
        return resp.status(500).send({message:"Internal Server Error",error})
    }
})
app.get("/getAllMenus",TokenChecker,async(req,resp)=>{
    try {
        const allMenus = await Menu.find({userId:req.user._id})
        if(!allMenus || allMenus.length===0) return resp.status(400).send({message:"Collection is Empty"})
        return resp.status(202).send({message:"Menus fetched successfully",data:allMenus})
    } catch (error) {
        return resp.status(500).send({message:"Internal Server Error",error})  
    }
})

const deleteImage = async(image) => {
    try {
        await fs.promises.unlink("./"+image)
        return {status:true}
    } catch (error) {
        return {status:false,error}
    }
}

app.delete("/deleteMenu/:menuId",TokenChecker,async(req,resp)=>{
    try {
        const {menuId} = req.params
        if(!menuId || !mongoose.isValidObjectId(menuId)) return resp.status(400).send({message:"Invalid Menu Id"})

        const existingMenu = await Menu.findOne({_id:menuId,userId:req.user._id})
        if(!existingMenu) return resp.status(400).send({message:"This menu does not exists"})
        
        const data = await deleteImage(existingMenu.image)
        if(!data.status) return resp.status(400).send({message:"Failed to delete image"})

        const deletedMenu = await Menu.deleteOne({_id:menuId,userId:req.user._id})
        return resp.status(202).send({message:"Menu Deleted",data:deletedMenu})
    } catch (error) {
        return resp.status(500).send({message:"Internal Server Error",error})
    }
})

app.put("/updateMenu/:menuId",TokenChecker,upload.single("image"),async(req,resp)=>{
    const newimage = req.file?"uploads/"+req.file.filename:null
    try {
        const {menuId} = req.params
        const {name,price,category} = req.body

        if(!menuId || !mongoose.isValidObjectId(menuId)) {
            if(newimage){
                const data = await deleteImage(newimage)
                if(!data.status) return resp.status(400).send({message:"Failed to delete new image"})
            }
            return resp.status(400).send({message:"Invalid Menu Id"})
        }

        if(!name || !price || !category || !name.trim() || !price.trim() || !category.trim()) {
            if(newimage){
                const data = await deleteImage(newimage)
                if(!data.status) return resp.status(400).send({message:"Failed to delete new image"})
            }
            return resp.status(400).send({message:"Fields are required"})
        }
        if(!Number(price)){
            if(newimage){
                const data = await deleteImage(newimage)
                if(!data.status) return resp.status(400).send({message:"Failed to delete new image"})
            }
            return resp.status(400).send({message:"Invalid price"})
        }

        const updatedName = name.trim().slice(0,1).toUpperCase() + name.trim().slice(1).toLowerCase()
        const updatedCategory = category.trim().toLowerCase()

        const existingMenu = await Menu.findOne({_id:menuId,userId:req.user._id})
        if(!existingMenu) {
            if(newimage){
                const data = await deleteImage(newimage)
                if(!data.status) return resp.status(400).send({message:"Failed to delete new image"})
            }
            return resp.status(400).send({message:"This menu does not exists"})
        }
            
        if(newimage){
            const data = await deleteImage(existingMenu.image)
            if(!data.status) return resp.status(400).send({message:"Failed to delete old image"})
            existingMenu.image=newimage
        }
        existingMenu.name = updatedName
        existingMenu.price = Number(price).toFixed(2)
        existingMenu.category = updatedCategory
        await existingMenu.save()
        return resp.status(202).send({message:"Menu updated successfully"})
    } catch (error) {
        if(newimage){
            const data = await deleteImage(newimage)
            if(!data.status) return resp.status(400).send({message:"Failed to delete new image and server error"})
        }
        return resp.status(500).send({message:"Internal Server Error",error})  
    }
})

app.get("/getAllUsers",async(req,resp)=>{
    try {
       const data = await User.find().select("-password")
       if(!data || data.length===0) return resp.status(400).send({message:"User Collection is Empty"})
       return resp.status(202).send({message:"Users fetched successfully",data})
    } catch (error) {
        return resp.status(500).send({message:"Internal Server Error",error})   
    }
})

app.get("/getAllButtons/:userId",async(req,resp)=>{
    try {
        const {userId} = req.params
        if(!userId || !mongoose.isValidObjectId(userId)) return resp.status(400).send({message:"Invalid User Id"})
        
        const existingUser = await User.findById(userId).select("-password")
        if(!existingUser) return resp.status(400).send({message:"User related to this id not exists"})

        const rawdata = await Menu.find({userId})
        const categories = rawdata.map((obj)=>obj.category)
        const updateddata = new Set(categories)
        const data = [...updateddata]
        return resp.status(202).send({message:"Buttons fetched successfully",data})
    } catch (error) {
        return resp.status(500).send({message:"Internal Server Error",error})   
    }
})

app.get("/getAllItems/:userId",async(req,resp)=>{
    try {
        const {userId} = req.params
        if(!userId || !mongoose.isValidObjectId(userId)) return resp.status(400).send({message:"Invalid User Id"})
        
        const existingUser = await User.findById(userId).select("-password")
        if(!existingUser) return resp.status(400).send({message:"User related to this id not exists"})

        const data = await Menu.find({userId})
        return resp.status(202).send({message:"Items fetched successfully",data})
    } catch (error) {
        return resp.status(500).send({message:"Internal Server Error",error})   
    }
})

app.get("/getAllItems/:userId/:category",async(req,resp)=>{
    try {
        const {userId,category} = req.params
        if(!userId || !mongoose.isValidObjectId(userId)) return resp.status(400).send({message:"Invalid User Id"})
        if(!category || !String(category) || !String(category).trim()) return resp.status(400).send({message:"Invalid Category"})

        const existingUser = await User.findById(userId).select("-password")
        if(!existingUser) return resp.status(400).send({message:"User related to this id not exists"})

        const updatedCategory = String(category)?.trim()?.toLowerCase()
        const data = await Menu.find({userId,category:updatedCategory})
        return resp.status(202).send({message:"Items fetched successfully",data})
    } catch (error) {
        return resp.status(500).send({message:"Internal Server Error",error})   
    }
})
app.listen(PORT,()=>console.log("Server Started At:"+PORT))
