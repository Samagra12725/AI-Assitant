import WebSocket, { WebSocketServer } from "ws";
import { getLLMResponse } from "./llm.js";

const wss = new WebSocketServer({ port: 8080 });

console.log(`WebSocket server running correctly `);

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    const userText = message.toString();
    console.log("User:", userText);

    try {
      const response = await getLLMResponse(userText);
      console.log("Sending response:", response);
      ws.send(response);
    } catch (error) {
      console.error("WebSocket Error:", error);
      const errorMessage = error.message || "Error processing your request";
      ws.send(`I encountered an issue: ${errorMessage}`);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
