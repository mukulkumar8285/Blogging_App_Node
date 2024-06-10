const userModel = require("../module/auth");
const jwt = require("jsonwebtoken");

const myjwtkey = "ejbiebcnbribfuirbfurhfbrref";


const vaildatedUserFunction = async(req , res , next)=>{
      // console.log(req.body);
  const headers = req.headers;
  // console.log(headers);

  /****************
   * Points to be vaildated in token.
   * 1. token should be present.
   * 2. secret key vaildation (This is the same token that we have generated).
   * 3. token expiry date should not be passed.
   * 4. vaildate the issued at date (optional).
   * 5. vaildate the user id if it present in database.
   ****************/
  // 1
  try {
    jwt.verify(headers.authorization, myjwtkey);
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized: Invalid token",
    });
  }
  // 2
  if (!headers.authorization) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }

  // 3 exp check
const tokendata = jwt.decode(headers.authorization);
  // console.log(tokendata.exp);
  // console.log(tokendata);
  const tokenexp = tokendata.exp;
  const now = Math.ceil(new Date().getTime() / 1000);
  if (tokenexp < now) {
    res.status(401).json({
      message: "Unauthorized: Token has expired",
    });
  }


  // 5
  const userId = tokendata.userId;
  const user = await userModel.findById(userId);
  if(!user){
    res.status(401).json({
      message: "Unauthorized: User not found",
      });
  }
  req.user = user;
  next();
}

module.exports = vaildatedUserFunction;