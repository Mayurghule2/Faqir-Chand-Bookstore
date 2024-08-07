const router = require("express").Router();
const User = require("../models/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const {authenticateToken} = require("./userAuth")



//Sign up
router.post('/sign-up', async(req, res)=>{
  try {
    const {username, email, password, address} = req.body;

    // check username length is more than 3
    if(username.length < 3){
      return res.status(400).json({message: "Username should be greaater than 3"});
    }

    // Check username already exists 
    const existingUsername = await User.findOne({username: username});
    if(existingUsername){
      return res.status(400).json({message: "Username already Exists!!!..."});
    }

    // Check email already exists 
    const existingEmail = await User.findOne({email: email});
    if(existingEmail){
      return res.status(400).json({message: "Email already Exists!!!..."});
    }

    // check password length is more than 5
      if(password.length < 6){
        return res.status(400).json({message: "Passwoed should be greaater than 6"});
      }

      // password hashing
      const hashPass = await bcrypt.hash(password, 10);

      const newUser = new User({
      username: username,
      email: email,
      password: hashPass,
      address: address
    });
    await newUser.save();
    return res.status(200).json({message: "Sign up Successfully "});
  } catch (error) {
    res.status(500).json({message: "Internal Server Error"});
  }
});


//Sign In
router.post('/sign-in', async(req, res)=>{
  try {
    const {username, password} = req.body;

    const existingUser = await User.findOne({username});
    if(!existingUser){
      res.status(400).json({message: "Invalid Credentials"});
    }

    await bcrypt.compare(password, existingUser.password, (err, data)=>{
      if(data){
        const authClaims= [
          {name: existingUser.username}, 
          {role: existingUser.role},
        ];
        const token = jwt.sign({authClaims}, "bookStore123", {
          expiresIn: "30d",
        })
        res.status(200).json({id: existingUser.id, role: existingUser.role, token: token});
      }
      else{
        res.status(400).json({message: "Invalid Credentials"});
      }
    })

  } catch (error) {
    res.status(500).json({message: "Internal Server Error"});
  }
});

// get-user information
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const {id} = req.headers;
    const data = await User.findOne({_id: id}).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: "Internal Server Error"});
  }
})

// Update address
router.put("/update-address", async (req, res)=>{
  try {
    const {id} = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, {address: address});
    return res.status(200).json({message: "Address Updated Successfully"})
  } catch (error) {
    res.status(500).json({message: "Internal Server Error"});
  }
})
module.exports = router;