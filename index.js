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
    password: String, 
})

const UserModel = mongoose.model('hieupractices', UserSchema)

app.post('/SignUp', async (req, res) => {
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

app.get('/getAllUsername', async (req, res) => {
  const checkUser = await UserModel.find(); 

  console.log(checkUser)
  if (!checkUser) {
    res.send({Message: `No note has been made`})
  }

  res.send({Message: `List`,note: checkUser} )
})

//Tạo file note trog tài khoản :
const NoteSchema = new Schema({
  title: String ,
  note: String ,
  LastUpdate: String
})

const NoteModel = mongoose.model('hieuNote', NoteSchema) 

//Tạo note
app.post('/createNote', async (req, res) => {
    const { title,note } = req.body;
    const Note = new NoteModel(); 

    Note.title = title; 
    Note.note = note; 
    //Note.LastUpdate = tgian lúc tạo ...  
    await Note.save();

    res.send({Message: `New note created` });
})

//hiện toàn bộ note
app.post('/getAllNotes', async (req, res) => {
  const checkNote = await NoteModel.find(); 

  if (!checkNote) {
    res.send({Message: `No note has been made`})
  }

  res.send({Message: `List`, note: checkNote} )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
