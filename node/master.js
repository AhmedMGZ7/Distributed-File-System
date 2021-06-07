const io = require("socket.io")(3000);
const { set, deleteCells, deleteRow, addRow, read } = require("./queries");
const mongoose = require("mongoose");
const { connect } = require("./connectDb");
const { App } = require("./App_model");
const fs = require("fs").promises;
const moment = require("moment");

// , {
// 	cors: {
// 	  origin: ["http://localhost:8080"],
// 	},
//   }

async function documentQueries(data) {
  await fs.writeFile("log.log", data, { flag: "a+" });
}

// meta data - data structures
catTabletDict = {};
tabletSizes = [0, 0, 0, 0];
tabMachineDict = [];
clients = []; // store the ips of the clients

// servers meta data
servers = [
  {
    up: 0,
    sid: -1,
    tablets: [],
    port: 3001,
    address: "",
  },
  { up: 0, sid: -1, tablets: [], port: 3002, address: "" },
];

connect("localhost", "GoogleApps");

io.on("connection", (socket) => {
  // connected to client
  socket.on("client", () => {
    clients.push(socket.id);
    sendMetaData();
    if (servers[0].up == 1 || servers[1].up == 1) {
      socket.emit("start");
    }

    io.to(clients[0]).emit("servers", servers);
    io.to(clients[1]).emit("servers", servers);
  });

  // connected to tablet server
  socket.on("tablet-server", async (address) => {
    let i = -1;
    // print(socket);
    // var address = socket.handshake.address;
    console.log("New connection from " + address);
    if (!servers[0].up) {
      servers[0].up = 1;
      servers[0].sid = socket.id;
      servers[0].address = address;
      i = 0;
    } else {
      servers[1].up = 1;
      servers[1].sid = socket.id;
      servers[1].address = address;
      i = 1;
    }
    // if one is not up then there were  none up before this one starts
    // so the clients were stopped
    if (!(servers[0].up && servers[1].up)) {
      // check if or
      io.to(clients[0]).emit("start", catTabletDict, tabMachineDict);
      io.to(clients[1]).emit("start", catTabletDict, tabMachineDict);
    }

    io.to(clients[0]).emit("servers", servers);
    io.to(clients[1]).emit("servers", servers);

    socket.emit("server-welcome", i, servers[i].port);
    await loadBalance(); // why call it after data is sent
  });

  // A machine has disconnected
  socket.on("disconnect", async () => {
    var index = clients.indexOf(socket.id);
    if (index > -1) {
      clients.splice(index, 1);
      console.log(`client ${socket.id} has disconnected`);
      return;
    }

    // todo
    // Load balance
    if (servers[0].sid == socket.id) {
      // 0 disconnected
      console.log("server 0 has disconnected");
      servers[0] = {
        up: 0,
        sid: -1,
        tablets: [],
        port: 3001,
      };
    } else {
      // 1 disconnected
      console.log("server 1 has disconnected");
      servers[1] = {
        up: 0,
        sid: -1,
        tablets: [],
        port: 3002,
      };
    }

    io.to(clients[0]).emit("servers", servers);
    io.to(clients[1]).emit("servers", servers);

    await loadBalance(); // inform the clients of the change
  });

  ops = ["Read", "Add Row", "Delete row", "Set", "Delete cells"];
  socket.on("update", async (op, tabNo, row_key, obj) => {
    // update the db
    switch (op) {
      case 0:
        break;
      case 1:
        addRow(App, row_key, obj);
        tabletSizes[tabNo] += 1;
        // check for balance and balance
        await check(tabletSizes);
        break;
      case 2:
        deleteRow(App, row_key);
        tabletSizes[tabNo] -= 1;
        // check for balance and balance
        await check(tabletSizes);
        break;
      case 3:
        set(App, row_key, obj);
        break;
      case 4:
        deleteCells(App, row_key, obj);
        break;
    }

    sentFrom = socket.id == servers[0].sid ? 0 : 1;
    // logging
    await documentQueries(
      `${
        ops[op]
      } operation on Server ${sentFrom} on tablet ${tabNo} at ${TimeNow()}\n`
    );
  });
});

// to check if Load Balance needed
async function check(tablets_size) {
  let threshold = 600;
  let avgSize =
    tablets_size[0] + tablets_size[1] + tablets_size[2] + tablets_size[3] / 4;
  //flag = false
  for (let i = 0; i < 4; i++) {
    if (Math.abs(tablets_size[i] - avgSize) > threshold) {
      await loadBalance();
      break;
    }
  }
}

async function loadBalance() {
  const noDocs = await App.countDocuments();
  const categories = await App.aggregate([
    {
      $group: {
        _id: "$Category",
        total: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  tabNo = 4;
  tabCount = noDocs / tabNo; // Count that the tablet should have
  currentTablet = 0;
  currentTabletSize = 0;

  categories.forEach((category) => {
    // If tablet is full and not the last one go to next
    if (currentTabletSize + category.total > tabCount) {
      if (currentTablet < 3) {
        tabletSizes[currentTablet] = currentTabletSize;
        currentTablet += 1;
        currentTabletSize = 0;
      }
    }
    catTabletDict[category._id] = currentTablet;
    currentTabletSize += category.total;
  });

  tabletSizes[currentTablet] = currentTabletSize;
  var tabletschanges = [
    tabletSizes[0],
    tabletSizes[1],
    tabletSizes[2],
    tabletSizes[3],
  ];

  let tablets = await App.find(
    {},
    {},
    {
      sort: {
        Category: "1",
      },
    }
  );
  //   console.log("tablets" + tablets)
  let tab1Docs = tablets.slice(0, tabletSizes[0]);
  let tab2Docs = tablets.slice(tabletSizes[0], tabletSizes[0] + tabletSizes[1]);
  let tab3Docs = tablets.slice(
    tabletSizes[0] + tabletSizes[1],
    tabletSizes[0] + tabletSizes[1] + tabletSizes[2]
  );
  let tab4Docs = tablets.slice(
    tabletSizes[0] + tabletSizes[1] + tabletSizes[2]
  );
  // console.log("tabletSizes", tabletSizes)
  // console.log("tab2Docs", tab2Docs )
  // console.log("tab4Doc", tab4Docs)
  if (servers[0].up == 1 && servers[1].up == 1) {
    io.to(servers[0].sid).emit("balance-tablet", [
      tab1Docs,
      tab2Docs,
      null,
      null,
    ]);
    io.to(servers[1].sid).emit("balance-tablet", [
      null,
      null,
      tab3Docs,
      tab4Docs,
    ]);
    tabMachineDict = [0, 0, 1, 1];
  } else if (servers[0].up == 1 || servers[1].up == 1) {
    index = servers[0].up == 1 ? 0 : 1;
    io.to(servers[index].sid).emit("balance-tablet", [
      tab1Docs,
      tab2Docs,
      tab3Docs,
      tab4Docs,
    ]);
    tabMachineDict = [index, index, index, index];
  } else {
    io.to(clients[0]).emit("stop", catTabletDict, tabMachineDict);
    io.to(clients[1]).emit("stop", catTabletDict, tabMachineDict);
    return;
  }
  sendMetaData();
}

function sendMetaData() {
  // send meta data
  // TODO: what if only one client
  io.to(clients[0]).emit("meta", catTabletDict, tabMachineDict);
  io.to(clients[1]).emit("meta", catTabletDict, tabMachineDict);
}

const TimeNow = () => {
  var date = moment().format().split(":");
  var current_date = date[0] + ":" + date[1];
  return current_date;
};
