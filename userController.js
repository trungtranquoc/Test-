const { model } = require("mongoose");
const { UserModel,NoteModel } = require("../model/model"); 

import bcrypt from 'bcrypt';
const saltRounds = 12;

const userController = {

    Hi : (req,res) => {
        res.send(`Hello Bitch`)
    }, 

    //Create a new account: 
    Signup :  async (req, res) => {
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
      },

    Login : async (req, res) => {
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
  },

  // Delete an user: 
    DeleteUser: async(req, res) => {
        try {
          await NoteModel.updateMany({userid: req.params.userid}, {userid: null}); 
          await UserModel.findByIdAndDelete(req.params.userid);
          res.send("Delete User successfully");  
        } catch (err) {
          res.status(500).json(err); 
        }
    }

}; 

module.exports = userController; 