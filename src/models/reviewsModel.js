const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "blog",
        required: true
    },
    reviewedBy:{
        type: String,
        default:"Guest"
    },
    reviewedAt:{
        type: String,
        required: true,
    },
    
    review: String,
    isDeleted:{
        type: Boolean,
        default: false
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
