var http = require("http");
var express = require("express");
var ejs = require("ejs");
var api = require("./controllers/api");
var render = require("./controllers/render");
var settings = require("./settings");
var app = express();

//set views
app.set("views", "./views");
app.set("view engine", "ejs");

//create server
http.createServer(app).listen(settings.getPort);
app.use(express.static("public"));

//set location of upload logic
require("./controllers/upload")(app);

//routes for api functions
app.route("/api/counter/:thread").get(api.getCounter);
app.route("/api/header").get(api.getHeader);
app.route("/api/boardlist").get(api.getBoardlist);
app.route("/api/postcomment/:type").get(api.getPostComment);
app.route("/api/threads/:type").get(api.getThreads);
app.route("/api/posts/:type").get(api.getPosts);
app.route("/api/popular").get(api.getPopular);
app.route("/api/announcements").get(api.getAnnouncements);
app.route("/api/stats").get(api.getStats);

//routes for pages
app.route("/:type/catalog").get(render.renderCatalog);
app.route("/:board/thread/:type").get(render.renderThread);
app.route("/:type").get(render.renderBoard);
app.route("/").get(render.renderHome);
app.route("*").get(render.renderPageNotFound);
