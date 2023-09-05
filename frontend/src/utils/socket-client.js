import { io } from "socket.io-client";

// export const socket = io(process.env.REACT_APP_DB_API);
export const socket = io("https://ketchup.fly.dev");
