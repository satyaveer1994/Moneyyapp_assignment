const reviewModel = require("../models/reviewsModel");
const blogModel = require("../models/blogModel");
const mongoose = require("mongoose");
const moment = require("moment");

const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

const createReview = async (req, res) => {
  try {
    const data = req.body;
    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "please fill all required feilds" });
    }
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) {
      return res
        .status(400)
        .send({ status: false, message: "please give valid blog id" });
    }
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).send({ status: false, message: "blog not found" });
    }
    if (blog.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, message: "blog is deleted" });
    }

    data.reviewedAt = moment().format();
    data.blogId = blogId;
    const review = await reviewModel.create(data);
    await blogModel.findByIdAndUpdate(
      { _id: blogId },
      { $inc: { reviews: 1 } }
    );
    return res
      .status(201)
      .send({ status: true, message: "success", data: review });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId, blogId } = req.params;
    if (!isValidObjectId(blogId)) {
      return res
        .status(400)
        .send({ status: false, message: "please give valid blog id" });
    }
    if (!isValidObjectId(reviewId)) {
      return res
        .status(400)
        .send({ status: false, message: "please give valid review id" });
    }
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).send({ status: false, message: "blog not found" });
    }
    if (blog.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, message: "blog already deleted" });
    }
    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .send({ status: false, message: "review not found" });
    }

    if (blogId != review.blogId) {
      return res
        .status(400)
        .send({ status: false, message: "review not found for this blog" });
    }
    const delReview = await reviewModel.findByIdAndUpdate(
      reviewId,
      { isDeleted: true },
      { new: true }
    );
    await blogModel.findByIdAndUpdate(
      { _id: blogId },
      { $inc: { reviews: -1 } }
    );
    return res.status(200).send({ status: true, data: delReview });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createReview, deleteReview };
