const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: { 
        type: String,
         required: "Blog title is required", 
        },
    body: { 
        type: String,
         required: "Blog body is required", 
        },
        authorId: {
      type: ObjectId,
      ref: "Author",
      required: "authorId is required",
    },
    isDeleted: { 
        type: Boolean, 
        default: false,
     },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
