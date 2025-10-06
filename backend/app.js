import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {createServer} from "node:http";
import {Server} from "socket.io";
import { socketServer } from "./controller/socketManager.js";
import userRouter from "./routes/user.routes.js";
import mongoose from "mongoose";

dotenv.config();
//initialization
const app = express();
const server = createServer(app);
const serverInstance = socketServer(server);


//middlewares
app.use(cors());
app.set("port", process.env.PORT || 8000);

app.use(express.json({limit: "50kb"}));
app.use(express.urlencoded({limit: "50kb", extended: true}));

app.use("/users", userRouter);

app.get("/",(req, res)=>{
    res.json({"message" : "API is working."}); // Sample
})

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connection successful...");

    server.listen(app.get("port"), () => {
      console.log("Server is listening on port", app.get("port"));
    });
  } catch (e) {
    console.log("Can't connect database. " + e);
  }
};

startServer();
