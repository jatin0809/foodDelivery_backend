const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const {User} = require("../schema/user.schema");
const jsonwebtoken = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth");
dotenv.config();

// register
router.post("/register", async (req, res)=> {
    const {name, email, password, number} = req.body;
    const ifUserExists = await User.findOne({email});
    if(ifUserExists){
        return res.status(400).json({message: "User already Exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, number, password: hashedPassword});
    await user.save();
    res.status(201).json({message: "User Created Successfully"});
})

// get all users
router.get("/", async (req, res)=>{
    const users = await User.find({}).select("-password");
    res.status(200).json({users});
})

// get user by email
router.get("/:email", async (req, res)=>{
    const {email} = req.params;
    const user = await User.find({email});
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    res.status(200).json(user);
})

// login
router.post("/login", async (req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({message: "Wrong email or password"});
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched){
        return res.status(401).json({message: "wrong email or password"});
    }
    const userId = user._id;
    const payload = {id:user._id};
    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({token, userId});
})

//updating user details
router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params; 
    const { name, email, number, country, gender, password } = req.body;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (number) user.number = number;
      if (country) user.country = country;
      if (gender) user.gender = gender;
  
      await user.save();
      res.status(200).json({ message: 'User updated successfully', user });
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;