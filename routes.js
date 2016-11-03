var express = require("express");
var render = require("./render");

var router = express.Router();

router.route("/:type/catalog").get(render.renderCatalog);
router.route("/:board/thread/:type").get(render.renderThread);
router.route("/:type").get(render.renderBoard);
router.route("/").get(render.renderHome);
router.route("*").get(render.renderPageNotFound);

module.exports = router;
