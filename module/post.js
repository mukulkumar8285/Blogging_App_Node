const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      default: "eibecuebciuebc",
    },
    tags: {
      type: Array,
      default: [],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    views: {
      type: Number,
    },
    comments: [
      {
        comment: {
          type: String,
        },
        date: {
          type: Date,
          default: new Date(),
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("posts", postSchema);

module.exports = PostModel;
