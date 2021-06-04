const io = require("socket.io-client");
const socket = io.connect("http://localhost:3000");

socket.on("connect", () => {
  console.log(`you connected with ${socket.id}`);
});

socket.emit("tablet-server", "let me in");
console.log("done");

let i = 0;

setInterval(() => {
  socket.emit("data-update", `${socket.id}: row number ${i} was updated`);
  i += 1;
}, 2000);

setInterval(() => {
  socket.emit("struc-update", `${socket.id}: rows number was changed`);
}, 10000);
