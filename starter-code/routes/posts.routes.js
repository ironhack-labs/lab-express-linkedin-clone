const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');

router.get("/:userId/posts/new", postsController.new);
router.post("/:userId/posts", postsController.create);


module.exports = router;