const io = require("socket.io-client");
const socket = io.connect("http://localhost:3000");
const ioServer = require('socket.io')


serverId = -1

socket.on("connect", () => {
  console.log(`you connected with ${socket.id}`);
});

socket.emit("tablet-server");
socket.on('tablet-welcome', (id, tablets, port) => {
	console.log(`my Id is ${id} and port is ${port}`)
	serverId = id;
	const IoServer = ioServer(port)
	IoServer.on('connection', socket => {
		console.log('ya mr7ab bel client el 5wl')
	})
	IoServer.on('addRow', socket => {
		console.log('ya mr7ab bel client el 5wl')
		socket.emit("struc-update", `${serverId}: rows number was changed`);
  });
  
  IoServer.on('deleteRow', socket => {
    console.log('ya mr7ab bel client el 5wl')
    socket.emit("struc-update", `${serverId}: rows number was changed`);
  });

  IoServer.on('set', socket => {
    console.log('ya mr7ab bel client el 5wl')
    socket.emit("data-update", `${serverId}: row-cells number was changed`);
  });
  IoServer.on('deleteCells', socket => {
    console.log('ya mr7ab bel client el 5wl')
    socket.emit("data-update", `${serverId}: row-cells number was changed`);
  });
  IoServer.on('read', socket => {
    console.log('ya mr7ab bel client el 5wl')
    socket.emit("data-Read", `${serverId}: nothing changed`);

	});
	
})

let i = 0;


setInterval(() => {
  socket.emit("data-update", `${serverId}: row number ${i} was updated`);
  i += 1;
}, 2000);

setInterval(() => {
  socket.emit("struc-update", `${serverId}: rows number was changed`);
}, 10000);

socket.on("check", (msg) => {
  console.log(`message:${msg}\n yes`);
  socket.emit('get-check', "yeaahhhhhhhhhhhhhhh")
});
