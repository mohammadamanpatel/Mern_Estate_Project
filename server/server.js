import express from "express";
const app = express();
import { config } from "dotenv";
import { v2 } from "cloudinary";
import cookie_parser from "cookie-parser";
import DBConnection from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import listingRouter from "./routes/listingsRoutes.js";
import file_upload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());
app.listen(process.env.port, async () => {
  await DBConnection();
  console.log("our app is running on this portNo:=>", process.env.port);
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);
const __dirname = path.resolve();
console.log("__dirname",__dirname);
console.log("process.env.CLOUD_NAME", process.env.CLOUD_NAME);
console.log("process.env.API_KEY", process.env.API_KEY);
console.log("process.env.API_SECRET", process.env.API_SECRET);
v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
app.use(
  file_upload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
