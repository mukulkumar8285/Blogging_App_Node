const express = require("express");
const authroute = require("./routes/auth");
const { mongoose } = require("mongoose");
const postlist = require("./routes/post");
const vaildatedUserFunction = require("./middleware/middelware");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth" , authroute);
app.use("/auth" ,vaildatedUserFunction , postlist);

mongoose.connect("mongodb://localhost:27017/authapp")
.then(()=> console.log("DB connection is successfully"))
.catch((err)=> console.log(err));
app.listen(8080 , ()=> console.log("App Running 8080"))

// console.log("print");