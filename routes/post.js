const express = require("express");



const postController = require("../controller/post");
const RollMiddleware = require("../middleware/userrole")

const router = express.Router();

router.get("/postroute" ,RollMiddleware("content_creater"), postController.listpost); //Retrieve all posts.
// router.get("/postroute" , postController.listpost);
router.post("/",RollMiddleware("content_creater"), postController.createPost); 
// router.post("/", postController.createPost);  //Create a new post.
router.get("/:id", postController.GetAPostById ); //Retrieve a specific post by ID.
router.put("/:id" , postController.UpdateThePostById);  //Update an existing post.
router.delete("/:id" , postController.DeleteAPostById); //Delete a post by ID.


//comments Routes


router.post("/comments/:PostId" , postController.Postcomment); //Create a new comment for a specific post.
router.put("/comments/:postId" , postController.EditThePostById); // Update an existing comment.
router.put("/comment/:postId" , postController.DeleteComment);

module.exports = router;