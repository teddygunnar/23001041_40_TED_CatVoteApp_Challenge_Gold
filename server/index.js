const express = require("express");
const userRoutes = require("./src/routes/userRoutes");
const catRoutes = require("./src/routes/catRoutes");
const likeRoutes = require("./src/routes/likeRoutes");
const authRoutes = require("./src/routes/authRoutes");
const clientRoutes = require("./src/views/routes");
const { authenticate } = require("./src/authorization/authMiddleware");
const http = require("http");
const path = require("path");
const cors = require("cors");
const ejs = require("ejs");
const createWebsocketServer = require("./websocket");

const app = express();
const PORT = process.env.PORT || 3005;
const HOST = process.env.HOST || "127.0.0.1";
const httpServer = http.createServer(app);

const wss = createWebsocketServer();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
  req.server = wss;
  next();
});

app.use(express.static(path.join(__dirname, "..", "./client")));

//VIEW ENGINE
app.set("views", path.join(__dirname, "..", "./client/pages"));
app.set("view engine", "ejs");
app.engine("html", ejs.renderFile);

//RENDER HTML FILES
app.use("/app", clientRoutes);

//API ENDPOINT
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/cats", authenticate, catRoutes);
app.use("/api/v1/like", authenticate, likeRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.redirect("/app/home");
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
