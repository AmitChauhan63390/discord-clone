import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false, // Ensure body parsing is disabled for socket.io requests
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });

    // Attach event handlers
    io.on("connection", (socket) => {
      console.log("New connection established", socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
      });
    });

    res.socket.server.io = io; // Store the io instance on the server socket
  }

  res.end(); // End the response
};

export default ioHandler;
