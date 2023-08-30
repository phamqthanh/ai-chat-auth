// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.setHeader("Content-type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");

  res.write(": Welcome to the event stream\n\n");
  let a = 0;

  // Simulate sending events at regular intervals
  const intervalId = setInterval(() => {
    const eventData = `data: ${JSON.stringify({ message: "Hello from server, " + a })}\n\n`;
    res.write(eventData);
    a++;
    if (a > 10) {
      clearInterval(intervalId);
      res.end();
    }
  }, 1000);
  // Close the connection when the client disconnects
  req.on("close", () => {
    clearInterval(intervalId);
    console.log("Client disconnected");
  });
}
