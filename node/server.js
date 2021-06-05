const io = require("socket.io-client");
const socket = io.connect("http://localhost:3000");
const ioServer = require("socket.io");
const mongoose = require("mongoose");
const { set, deleteCells, deleteRow, addRow, read } = require("./queries");
const { Tab1, Tab2, Tab3, Tab4 } = require("./tablet_model");
const { connect } = require("./connectDb");

serverId = -1;

socket.on("connect", () => {
  console.log(`you connected with ${socket.id}`);
});

// notify the master that this machine is a server
socket.emit("tablet-server");

// recieve tablets and initialize the db
socket.on("server-welcome", (id, tablets, port) => {
  console.log(`my Id is ${id} and port is ${port}`);
  serverId = id;

  // connect to db
  connect("localhost", `db${port}`);

  // create server socket for clients on port recieved from master
  const IoServer = ioServer(port);

  // handle client requests
  IoServer.on("connection", (socket) => {
    socket.on("addRow", (row_key, obj, tabNo) => {
      console.log("A client requests to addrow");
      addRow(row_key, obj);
      socket.emit("struc-update", `${serverId}: rows number was changed`);
    });

    socket.on("deleteRow", (row_key, obj, tabNo) => {
      console.log("delete request");
      socket.emit("struc-update", `${serverId}: rows number was changed`);
    });

    socket.on("set", (row_key, obj, tabNo) => {
      console.log("set request");
      socket.emit("data-update", `${serverId}: row-cells number was changed`);
    });
    socket.on("delete", (row_key, obj, tabNo) => {
      console.log("delete cell request");
      socket.emit("data-update", `${serverId}: row-cells number was changed`);
    });
    IoServer.on("read", (row_key, obj, tabNo) => {
      console.log("read request");
      socket.emit("data-Read", `${serverId}: nothing changed`);
    });
  });
});


socket.on('5od tablet', (msg) => {
	console.log(msg)
})
