const express = require('express')
const app = express()
const port = 3000
import mongoose, { Schema, mongo } from 'mongoose' 
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const saltRounds = 12; 
app.use(express.json())


mongoose.connect("mongodb+srv://GDSC:gdscurlshortener123@cluster0.4mncv.mongodb.net/Hieu?authSource=admin&replicaSet=atlas-h2i7y8-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true")
        .then(() => console.log("Xinh đẹp tuyệt vời, chúc ngày mới an lành!"))

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true}, 
    password: String
})

const UserModel = mongoose.model('HieuPractice', UserSchema)

app.post('/Student/SignUp', async (req, res) => {
  try {
    var { username,password } = req.body; 
  const user = new UserModel();
  user.username = username; 
  user.password = await bcrypt.hash(password, saltRounds); 

  await user.save();

  if (!username || !password) {
    throw Error(`Chưa nhập Tài Khoản hoặc Mật Khẩu !`)
  }

  const isCheck = await UserModel.findOne(); 
  if (!isCheck){
    throw Error(`User Account has been existed, plz try new one`)
  }

  res.send({Message: 'Sign up successfully', user: user}); 
  } catch (error) {
    res.send(error.message) 
  }
  
})

app.post('/Login', async (req, res) => {
      try{
      const { username,password } = req.body; 

      if (!username || !password) {
        throw Error("No username or password")
      }

      const users = await UserModel.findOne({username: username})
      if (!users){
        throw Error(`No username match`)
      }
      
        let isMatch = await bcrypt.compare(password, users.password)
      if (!isMatch){
        throw Error('Wrong password')
      }
      res.send({Message: 'Login successfully', users: users})
    } catch (error) {
      res.send(error.message) 
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})