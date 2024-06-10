const userModel = require("../module/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const myjwtkey = "ejbiebcnbribfuirbfurhfbrref";

const signup = async (req, res) => {
  try {
  // console.log(req.body);
  const { email } = req.body;
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  } else {
    const salt = bcrypt.genSaltSync(saltRounds);
    const PasswordHash = bcrypt.hashSync(req.body.password, salt);

    const username = new userModel({ ...req.body, password: PasswordHash });
    const newuserInsertData = await username.save();
    // console.log(newuserInsertData._id);
  }
  res.json({
    success: true,
    msg: "this Api Are Use In Signup",
  });
}catch(err){
  console.log(err);
}
}



const signin = async (req, res) => {
  const { email } = req.body;

  const existingUser = await userModel.findOne({ email });
  try {
    const passwordvalid = bcrypt.compareSync(req.body.password , existingUser.password);
    // console.log(passwordvalid);

  const tokenexpiry = Math.floor(new Date().getTime()/1000)+3600;

  const payload = {
    userId : existingUser._id,
    name : existingUser.name,
    exp: tokenexpiry,
  }


const token =  jwt.sign(payload, myjwtkey)
    if (!existingUser) {
    //jwt toke
      return res.status(400).json({ message: "User Not Found" });
    } else if (passwordvalid) {
      console.log(existingUser._id);
      res.json({
        token,
      });
    } else {
      return res.status(400).json({ message: "User Not Found Id Not Match" });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: "Wrong Password",
    });
  }
};


const blacklistedTokens = new Set();

const logout = async (req, res) => {
  try {
    // Check if Authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the Authorization header

    // Add the token to the blacklist
    blacklistedTokens.add(token);

    res.json({
      message: "Logged out successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Middleware to check if token is blacklisted
const checkTokenBlacklist = (req, res, next) => {
  // Check if Authorization header exists
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the Authorization header

    // Check if token is blacklisted
    if (blacklistedTokens.has(token)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Token is valid, call the next middleware
    next();
  } catch (error) {
    console.error("Error parsing token:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};



const authcontroller = {
  signin,
  signup,
  logout,
  checkTokenBlacklist,
};

module.exports = authcontroller;






