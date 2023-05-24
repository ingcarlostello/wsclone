import mongoose from "mongoose";
import { server } from "./app.js";
import { DB_HOST, DB_PASSWORD, DB_USER, IP_SERVER, PORT } from "./constants.js";
import { io } from "./utils/socketServer.js";

const mongoUrl = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}`;


mongoose.connect(mongoUrl, (error) => {
      if (error) throw error;

      server.listen(PORT, () => {
            console.log(`Example app listening on http://${IP_SERVER}:${PORT}/api`);

            io.on("connection", (socket) => {
                  console.log("NUEVO USUARIO CONECTADO");
            
                  socket.on("disconnect", () => {
                        console.log("USUARIO DESCONECTADO");
                  });
            
                  socket.on("subscribe", (room) => {
                        socket.join(room);
                  });
            
                  socket.on("unsubscribe", (room) => {
                        socket.leave(room);
                  });
            });
      });
});


