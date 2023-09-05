import { io } from "socket.io-client";

// export const socket = io(process.env.REACT_APP_DB_API);
export const socket = io.connect("https://ketchup.fly.dev", {
  //   withCredentials: true,
  transports: ["websocket"],
  //   transportOptions: {
  //     polling: {
  //       extraHeaders: {
  //         "Access-Control-Allow-Origin": "http://localhost:3000",
  //       },
  //     },
  //   },
});
