const express = require("express");
const articlesRoute = require("./src/routes/articles");
const userRoutes = require("./src/routes/userRoutes");
const catRoutes = require("./src/routes/catRoutes");
const likeRoutes = require("./src/routes/likeRoutes");
const authRoutes = require("./src/routes/authRoutes");
const clientRoutes = require("./src/views/routes");
const { authenticate } = require("./src/authorization/authMiddleware");
const path = require("path");
const cors = require("cors");
const ejs = require("ejs");

const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 3005;
const HOST = process.env.HOST || "127.0.0.1";

const server = new WebSocket.Server({ port: PORT });

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use(express.static(path.join(__dirname, "..", "./client")));

//VIEW ENGINE
app.set("views", path.join(__dirname, "..", "./client/pages"));
app.set("view engine", "ejs");
app.engine("html", ejs.renderFile);

//RENDER HTML FILES
app.use("/app", clientRoutes);

//API ENDPOINT
// app.use("/articles", authenticate, articlesRoute);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/cats", authenticate, catRoutes);
app.use("/api/v1/like", authenticate, likeRoutes);
app.use("/api/v1/auth", authRoutes);

server.on("connection", (socket) => {
  console.log("client connection");
  socket.on("message", (message) => {
    // Process the message and send a response if needed
    socket.send("stop sending me " + message);

    socket.on("close", () => {
      console.log("Client disconnected");
    });
  });
});

//write API here

//get karyawan
// app.get("/karyawan", async (req, res) => {
//   const karyawan = await db("karyawan").select("*");
//   return res.status(200).json({ data: karyawan });
// });

// //get karyawan by id
// app.get("/karyawan/:id", async (req, res) => {
//   const { id } = req.params;

//   const karyawan = await db("karyawan")
//     .select("*")
//     .where({
//       id: id,
//     })
//     .first();

//   if (!karyawan)
//     return res.status(400).json({ message: "ID tidak dapat ditemukan" });

//   return res.status(200).json({ data: karyawan });
// });

// //post karyawan
// app.post("/karyawan", async (req, res) => {
//   const { nama, jabatan } = req.body;

//   const karyawan = await db("karyawan")
//     .insert({
//       nama,
//       jabatan,
//     })
//     .returning(["id"]);

//   return res.status(200).json({
//     message: "Data berhasil ditambahkan",
//     data: {
//       id: karyawan[0].id,
//       nama,
//       jabatan,
//     },
//   });
// });

// //update karyawan
// app.put("/karyawan/:id", async (req, res) => {
//   const { id } = req.params;
//   const { nama, jabatan } = req.body;

//   const _id = await db("karyawan").where({ id: id });
//   //prettier-ignore
//   if (!_id.length) return res.status(400).json({ message: "ID tidak dapat ditemukan" });

//   await db("karyawan").where({ id: id }).update({
//     nama,
//     jabatan,
//   });

//   return res.status(200).json({
//     message: "Data berhasil dirubah!",
//     data: {
//       id: _id[0].id,
//       nama,
//       jabatan,
//     },
//   });
// });

// //delete karyawan
// app.delete("/karyawan/:id", async (req, res) => {
//   const { id } = req.params;
//   const _id = await db("karyawan").where({ id: id });

//   //prettier-ignore
//   if (!_id.length) return res.status(400).json({ message: "ID tidak dapat ditemukan" });

//   await db("karyawan")
//     .where({
//       id: id,
//     })
//     .del();

//   return res.json({
//     message: `Data dengan id ${id} berhasil dihapus!!`,
//   });
// });

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
