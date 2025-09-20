import { Server } from "socket.io";

export const socketServer = (server) =>{
    const io = new Server(server);
    return io;
}