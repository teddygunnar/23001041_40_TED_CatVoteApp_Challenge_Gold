const WebSocket = require("ws");

const createWebSocketServer = () => {
  const wss = new WebSocket.Server({ port: 3005, host: "127.0.0.2" });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
      console.log(`Received: ${message}`);
    });

    ws.on("close", () => {
      console.log("Client disconnected");

      setTimeout(() => {
        wss.close();
        createWebSocketServer();
      }, 2000);
    });
  });

  return wss;
};

module.exports = createWebSocketServer;
