import express from "express";
import connectDB from "./lib/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import { app, server } from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// all routes
import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  
// middlewares
app.use(bodyParser.json({ limit: "50mb" })); // Increase limit for JSON bodies
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // Increase limit for URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  connectDB();
  console.log(`Example app listening on port ${PORT}`)
})