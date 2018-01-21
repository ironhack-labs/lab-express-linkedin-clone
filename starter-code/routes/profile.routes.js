const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');

router.get("/:userId/edit", profileController.edit);

router.post("/:userId", profileController.update);
router.get("/:userId", profileController.show);


module.exports = router;