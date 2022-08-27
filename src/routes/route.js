const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const reviewsController = require("../controllers/reviewsController")



// Create author // authorLogin
router.post('/author',authorController.registerAuthor)


// blog

router.post("/createBlog",blogController.createBlog)
router.get("/blogs/:blogId",blogController.getAllBlogs)

router.put("/update/:blogId",blogController.updateBlog)
router.delete("/delete/:blogId",blogController.deleted)


// reviews

router.post("/blogs/:blogId/review",reviewsController.createReview)
router.delete("blogs/:blogId/review/:reviewId",reviewsController.deleteReview)












module.exports = router