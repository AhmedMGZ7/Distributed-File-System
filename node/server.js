const io = require("socket.io-client");

let MasterUrl = ""
const csocket = io.connect(`${MasterUrl}`);
const ioServer = require("socket.io");
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
  console.log(`my Id is ${id}`);
  serverId = id;

  // connect to db
  connect("localhost", `db${port}`);

  // create server socket for clients on port recieved from master
  const IoServer = ioServer(3000);

  // handle client requests
  IoServer.on("connection", (socket) => {
    socket.on("addRow", async (tabNo, query) => {
      console.log("A client requests to addrow");
      await addRow(models[tabNo], query);
      csocket.emit("update", 1, tabNo, query);
    });

    socket.on("deleteRow", async (tabNo, query) => {
      console.log("delete request");
      await deleteRow(models[tabNo], query);
      csocket.emit("update", 2, tabNo, query);
    });

    socket.on("set", async (tabNo, query) => {
      console.log("set request");
      await set(models[tabNo], query);
      csocket.emit("update", 3, tabNo, query);
    });

    socket.on("deleteCells", async (tabNo, query) => {
      console.log("delete cell request");
      await deleteCells(models[tabNo], query);
      csocket.emit("update", 4, tabNo, query);
    });

    socket.on("read", async (tabNo, query) => {
      console.log("read request");
      let row = await read(models[tabNo], query);
      socket.emit("read-data", row);
      csocket.emit("update", 0, tabNo, query);
    });
  });
});

csocket.on("balance-tablet", async (tablets) => {
  for (let i = 0; i < tablets.length; i++) {
    if (await models[i].exists({})) {
      await models[i].collection.drop();
    } 
	 
    if (tablets[i] != null) await models[i].create(tablets[i]);
    
  }
});
