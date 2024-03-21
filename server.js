const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

//env conf
dotenv.config();

//DB Conn.
connectDB();

//REST obj
const app = express();

//Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());

//Routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const port = process.env.PORT || 8080;

//Port
app.listen(port, () => {
  console.log(
    `Server in ${process.env.NODE_MODE} mode, port = ${process.env.PORT}`
  );
});
