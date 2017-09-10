const router = require('express').Router();
const myRoutes = require('./myRoutes/indexRoutes')
/* GET home page. */

router.get('/signup', myRoutes.signup);
router.post("/signup", myRoutes.postSignUp)
router.get('/login',myRoutes.login)
router.post('/login', myRoutes.postLogin)
router.get('/logout', myRoutes.logOut)
router.get("/profilesList", myRoutes.profiles)
router.get("/publicprofile/:id", myRoutes.publicView)
module.exports = router;
