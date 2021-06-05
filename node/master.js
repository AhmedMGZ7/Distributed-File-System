const io = require("socket.io")(3000);
const mongoose = require("mongoose");
const { set, deleteCells, deleteRow, addRow, read } = require("./queries");
const { connect } = require("./connectDb");
const { App } = require("./App_model");
// , {
// 	cors: {
// 	  origin: ["http://localhost:8080"],
// 	},
//   }

connect("localhost", "GoogleApps");

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
  
  catTabletDict = {}
  tabletSizes = {}
  tabNo = 4
  tabCount = noDocs / tabNo			// Count that the tablet should have
  currentTablet = 0					
  currentTabletSize = 0		
  console.log(categories)	
console.log(tabCount)		
  categories.forEach(category => {
	console.log(currentTabletSize, category.total)
	
  // If tablet is full and not the last one go to next
  if (currentTabletSize + category.total > tabCount && currentTablet < 3) {
    tabletSizes[currentTablet] = currentTabletSize;
    currentTablet += 1;
    currentTabletSize = 0;
  }

  catTabletDict[category._id] = currentTablet;
  currentTabletSize += category.total;
})

  tabletSizes[3] = currentTabletSize
  console.log(catTabletDict)
  console.log(tabletSizes)
	let tablets = await App.find()
	let tab1Docs = tablets.slice(0,tabletSizes[0])
	let tab2Docs = tablets.slice(tabletSizes[0],tabletSizes[0]+tabletSizes[1])
	let tab3Docs = tablets.slice(tabletSizes[0] + tabletSizes[1],tabletSizes[0] + tabletSizes[1] + tabletSizes[2])
	let tab4Docs = tablets.slice(tabletSizes[0] + tabletSizes[1] + tabletSizes[2])
  
  if (servers[0].up == 1 && servers[1].up == 1) {
	  io.to(servers[0].sid).emit("balance-tablet", [tab1Docs,tab2Docs]);
    io.to(servers[1].sid).emit("balance-tablet", [tab3Docs,tab4Docs]);
  } 
  else if (servers[0].up == 1 || servers[1].up == 1) {
    index = (servers[0].up == 1)? 0 : 1;
    io.to(servers[index].sid).emit("balance-tablet", [tab1Docs,tab2Docs,tab3Docs,tab4Docs]);
  } 
  else {
    console.log("error");
  }
}

servers = [
  {
    up: 0,
    sid: -1,
    tablets: [],
    port: 3001,
  },
  { up: 0, sid: -1, tablets: [], port: 3002 },
];

clients = [];

io.on("connection", (socket) => {
  // connected to client
  socket.on("client", () => {
    clients.push(socket.id);
  });

  // connected to tablet server
  socket.on("tablet-server", () => {
    let i = -1;
    if (!servers[0].up) {
      servers[0].up = 1;
      servers[0].sid = socket.id;
      // servers[0].tablets = []  to be done
      i = 0;
    } else {
      servers[1].up = 1;
      servers[1].sid = socket.id;
      // servers[1].tablets = []  to be done
      i = 1;
    }
	socket.emit("server-welcome", i, servers[i].port);
    loadBalance();
  });

  // A machine has disconnected
  socket.on("disconnect", () => {
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
  });

  socket.on("data-update", (msg) => {
    // update the db
    console.log(msg);
  });

  socket.on("struc-update", (msg) => {
    // check if load balancing is needed and update db
    console.log(msg);
  });
});
