import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { initSocketServer } from "./utils/socketServer.js";
import { authRoutes, userRoutes, chatRoutes, chatMessageRoutes } from "./routes/index.js";


const app = express();
const server = http.createServer(app);
initSocketServer(server); // se le pasar el servidor de express a socket para que cree un servidor de sockets

// body parser
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(express.static("uploads"));

app.use(cors());

app.use(morgan("dev"));

//Rutas
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", chatRoutes)
app.use("/api", chatMessageRoutes)

export { server };
