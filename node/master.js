const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});

io.on("connection", (socket) => {
  console.log(`connected to ${socket.id}`);
  socket.on("tablet-server", (tabletMsg) => {
    console.log(tabletMsg);
  });

  socket.on("data-update", (msg) => {
	  console.log(msg)
  })

  socket.on("struc-update", (msg) => {
	  console.log(msg)
  })
});
