var express = require("express");
var api = require("./api");

var router = express.Router();

router.route("/counter/:thread").get(api.getCounter);
router.route("/header").get(api.getHeader);
router.route("/boardlist").get(api.getBoardlist);
router.route("/postcomment/:type").get(api.getPostComment);
router.route("/threads/:type").get(api.getThreads);
router.route("/posts/:type").get(api.getPosts);
router.route("/popular").get(api.getPopular);
router.route("/announcements").get(api.getAnnouncements);
router.route("/stats").get(api.getStats);

module.exports = router;
