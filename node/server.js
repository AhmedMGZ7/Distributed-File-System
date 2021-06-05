const io = require("socket.io-client");
const csocket = io.connect("http://localhost:3000");
const ioServer = require("socket.io");
const mongoose = require("mongoose");
const { set, deleteCells, deleteRow, addRow, read } = require("./queries");
const { Tab1, Tab2, Tab3, Tab4 } = require("./tablet_model");
const { connect } = require("./connectDb");

var models = [Tab1, Tab2, Tab3, Tab4];

serverId = -1;

csocket.on("connect", () => {
  console.log(`you connected with ${csocket.id}`);
});

// notify the master that this machine is a server
csocket.emit("tablet-server");

// recieve tablets and initialize the db
csocket.on("server-welcome", (id, port) => {
  console.log(`my Id is ${id} and port is ${port}`);
  serverId = id;

  // connect to db
  connect("localhost", `db${port}`);

  // create server socket for clients on port recieved from master
  const IoServer = ioServer(port);

  // handle client requests
  IoServer.on("connection", (socket) => {
	
    socket.on("addRow", async (row_key, tabNo, obj) => {
      console.log("A client requests to addrow");
      await addRow(models[tabNo], row_key, obj);
      csocket.emit("update", 1, tabNo, row_key, obj);
    });

    socket.on("deleteRow", async (row_key, tabNo) => {
      console.log("delete request");
	  await deleteRow(models[tabNo], row_key)
      csocket.emit("update", 2, tabNo, row_key);
    });

    socket.on("set", async (row_key, tabNo, obj) => {
      console.log("set request");
	  await set(models[tabNo], row_key, obj)
      csocket.emit("update", 3, tabNo, row_key, obj);
    });

    socket.on("deleteCells", async (row_key, tabNo, columns) => {
      console.log("delete cell request");
	  await deleteCells(models[tabNo], row_key, columns)
      csocket.emit("update", 4, tabNo, row_key, columns);
    });

    IoServer.on("read", async (row_key, tabNo) => {
      console.log("read request");
	  let row = await read(models[tabNo], row_key)
		socket.emit('read-data', row)
    });
  });
});

csocket.on("balance-tablet", async (tablets) => {
	for (let i = 0; i < tablets.length; i++) {
	await addRow(models[i], 'row$key', {Category:'dummy', App:'dummy'})
	await models[i].collection.drop();
	if (tablets[i] != null)
    	await models[i].create(tablets[i]);
  }
});
