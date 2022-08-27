const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const reviewsModel = require("../models/reviewsModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length > 0) return true;
  return false;
};

const createBlog = async function (req, res) {
  try {
    let data = req.body;
    let id = req.body.authorId;
    // checking if data is empty
    if (Object.keys(data) == 0)
      // returning 400 {bad request data is empty}
      return res
        .status(400)
        .send({ status: false, msg: "Bad request. Content to post missing" });
    const { title, body } = data;

    let idMatch = await authorModel.findById(id);
    // id match in author model, if not
    if (!idMatch)
      return res
        .status(404)
        .send({ status: false, msg: "No such author present in the database" });
    if (!isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: " Blog title is required" });
    }

    if (!isValid(body)) {
      return res
        .status(400)
        .send({ status: false, message: " Blog body is required" });
    }
    let savedData = await blogModel.create(data);

    return res.status(201).send({ status: true, msg: savedData });
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};
////////////////////////////////////////////////////////////

const getAllBlogs = async function (req, res) {
  try {
    const data = req.query;
    if (Object.keys(data) == 0)
      return res.status(400).send({ status: false, msg: "No input provided" });

    const blogs = await blogModel
      .find({
        $and: [data, { isDeleted: false }],
      })
      .populate("AuthorId");
    if (blogs.length == 0)
      return res
        .status(404)
        .send({ status: false, msg: "No blogs Available." });
    return res
      .status(200)
      .send({ status: true, count: blogs.length, data: blogs });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const updateBlog = async function (req, res) {
  try {
    //Validate: The blogId is present in request path params or not.
    let blog_Id = req.params.blogId;
    if (!blog_Id)
      return res
        .status(400)
        .send({ status: false, msg: "Blog Id is required" });

    //Validate: The blogId is valid or not.
    let blog = await blogModel.findById(blog_Id);
    if (!blog)
      return res
        .status(404)
        .send({ status: false, msg: "Blog does not exists" });

    //Validate: If the blogId exists (must have isDeleted false)
    let is_Deleted = blog.isDeleted;
    if (is_Deleted == true)
      return res
        .status(404)
        .send({ status: false, msg: "Blog is already deleted" });

    //Updates a blog by changing the its title, body,
    let Title = req.body.title;
    let Body = req.body.body;

    let updatedBlog = await blogModel.findOneAndUpdate(
      { _id: blog_Id },
      {
        $set: {
          title: Title,
          body: Body,
        },
      },
      { new: true }
    );
    //Sending the updated response
    return res.status(200).send({ status: true, data: updatedBlog });
  } catch (err) {
    console.log("This is the error :", err.message);
    return res
      .status(500)
      .send({ status: false, msg: " Server Error", error: err.message });
  }
};

const deleted = async function (req, res) {
  try {
    //Validate: The blogId is present in request path params or not.
    let blog_Id = req.params.blogId;
    if (!blog_Id)
      return res
        .status(400)
        .send({ status: false, msg: "Blog Id is required" });

    //Validate: The blogId is valid or not.
    let blog = await blogModel.findById(blog_Id);
    if (!blog)
      return res
        .status(404)
        .send({ status: false, msg: "Blog does not exists" });

    //Validate: If the blogId is not deleted (must have isDeleted false)
    let is_Deleted = blog.isDeleted;
    if (is_Deleted == true)
      return res
        .status(404)
        .send({ status: false, msg: "Blog is already deleted" });

    //Delete a blog by changing the its isDeleted to true.
    let deletedBlog = await blogModel.findOneAndUpdate(
      { _id: blog_Id },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    //Sending the Deleted response after updating isDeleted : true
    return res.status(200).send({ status: true, data: deletedBlog });
  } catch (err) {
    console.log("This is the error :", err.message);
    return res
      .status(500)
      .send({ status: false, msg: " Server Error", error: err.message });
  }
};

module.exports = { createBlog, getAllBlogs, updateBlog, deleted };
