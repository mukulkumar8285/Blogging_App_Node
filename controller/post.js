const userModel = require("../module/auth");
const PostModel = require("../module/post");
// const postList = require("./PostData");

const listpost = async (req, res) => {
  const pageNo = req.query.pageNo*1;
  const limit = req.query.limit*1 || 10;
  console.log(pageNo);
  const PostListApi = await PostModel.find({})
    .skip((pageNo-1) * limit)
    .limit(limit)
    // .sort({views : -1})
    .populate("userId"); // 1. Way Of travel To userId
  // const PostListApi = await PostModel.find();
  // for(let i=0;i<PostListApi.length;i++){ // 2 . Way To Travel To UserId
  //   const UserDetails = await userModel.findById(PostListApi[i].userId);
  //   PostListApi[i].userId = UserDetails;
  // }

  res.json({
    result: PostListApi,
  });
};

const createPost = async (req, res) => {
  const newPost = new PostModel({ ...req.body, userId: req.user._id });
  await newPost.save();
  // console.log("This Is A User Id" , req.user._id);
  res.json({
    message: "create post",
  });
};

const GetAPostById = async (req, res) => {
  const PostId = req.params.id;
  // console.log("This Is a Id OF gET iD : ", id);
  const post = await PostModel.findById(PostId).populate("userId");
  res.json({
    msg: post,
  });
};

const UpdateThePostById = async (req, res) => {
  const UpdateId = req.params.id;
  const Update = await PostModel.findByIdAndUpdate(UpdateId, req.body);
  res.json({
    msg: Update,
  });
};

const DeleteAPostById = async (req, res) => {
  const DeleteId = req.params.id;
  const DeleteById = await PostModel.findByIdAndDelete(DeleteId);

  res.json({
    msg: DeleteById,
  });
};


const Postcomment = async(req,res)=>{
  console.log(req.body);
  console.log(req.params.PostId);
await PostModel.updateOne({_id: req.params.PostId} ,{
  $push:{
    comments:{comment : req.body.comment , userId : req.user._id},
    },
})

  res.json({
    msg:"This Is A Post Comment"
  })
}

const EditThePostById = async (req, res) => {
  try {
    // Extract the post ID from the request parameters
    const postId = req.params.postId;

    // Extract the comment ID and new comment text from the request body
    const commentId = req.body.commentId; // The ID of the comment to edit
    const newCommentText = req.body.newComment; // The new text for the comment

    // Extract the user ID from the authenticated user (assume it's set in req.user)
    const userId = req.user._id;

    // Check if the newCommentText is provided, if yes, update the comment
    if (newCommentText) {
      const result = await PostModel.updateOne(
        { _id: postId, "comments._id": commentId, "comments.userId": userId },
        { $set: { "comments.$.comment": newCommentText, "comments.$.updatedAt": new Date() } }
      );

      if (result.nModified === 0) {
        return res.status(404).json({
          msg: "Comment not found or user not authorized to edit this comment"
        });
      }

      return res.json({
        msg: "Comment updated successfully",
        newComment: newCommentText
      });
    }
  }catch(err){
    console.log(err);
  }
}
    // If newCommentText is not provided, delete the comment
  const DeleteComment = async(req , res)=>{
    const postId = req.params.postId;

 
    const commentId = req.body.commentId; // The ID of the comment to edit
  

    // Extract the user ID from the authenticated user (assume it's set in req.user)
    const userId = req.user._id;
    try{
    const deletionResult = await PostModel.updateOne(

     
      { $pull: { comments: { _id: commentId } } }
    );

    if (deletionResult.nModified === 0) {
      return res.status(404).json({
        msg: "Comment not found or user not authorized to delete this comment"
      });
    }

    res.json({
      msg: "Comment deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "An error occurred while updating the comment"
    });
  }
};



const postController = {
  listpost,
  createPost,
  GetAPostById,
  UpdateThePostById,
  DeleteAPostById,
  Postcomment,
  EditThePostById,
  DeleteComment,
};

module.exports = postController;
