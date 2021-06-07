const io = require("socket.io-client");
let MasterUrl = "http://localhost:3000";
// let server1Url = "http://localhost:3001"; //"http://8d069fd894c3.ngrok.io/"
// let server2Url = "http://localhost:3002"; //"http://2701c8b92c84.ngrok.io/"

let server1Url = ""; //"http://8d069fd894c3.ngrok.io/"
let server2Url = ""; //"http://2701c8b92c84.ngrok.io/"

const socket = io.connect(`${MasterUrl}`);
var server1socket = null;
var server2socket = null;
// var server1socket = io.connect(`${server1Url}`);
// var server2socket = io.connect(`${server2Url}`);

const fs = require("fs").promises;

// meta data - data structures
var catTabletDict = {};
var tabMachineDict = [];

//set Interval ID
setIntervalId = -1;
// current query
index = 0;
var queryList;
async function getQueryList() {
  queryList = await getUserQueries();
}
getQueryList();

socket.on("connect", () => {
  console.log(`you connected with ${socket.id}`);
  socket.emit("client");
});

socket.on("start", async () => {
  setIntervalId = sendQuery(index, queryList);
});

socket.on("meta", async (catTabletDict, tabMachineDict) => {
  console.log("meta is received");
  global.catTabletDict = catTabletDict;
  global.tabMachineDict = tabMachineDict;
});

socket.on("servers", async (servers) => {
  global.server1Url = servers[0].address;
  global.server2Url = servers[1].address;

  console.log("server 1 ", servers[0].address);
  console.log("server 2 ", servers[1].address);
  server1socket = io.connect(`${servers[0].address}`);
  server2socket = io.connect(`${servers[1].address}`);

  server1socket.on("connect", () => {
    console.log("connected with server 1");
  });
  server2socket.on("connect", () => {
    console.log("connected with server 2");
  });

  server1socket.on("read-data", (row) => {
    console.log(row);
  });
  server2socket.on("read-data", (row) => {
    console.log(row);
  });
});

socket.on("stop", () => {
  clearInterval(setIntervalId);
});

function getDesiredServer(cat, catTabletDict, tabMachineDict) {
  let bool = tabMachineDict[catTabletDict[cat]] == 0;
  return bool ? server1socket : server2socket;
}

async function getUserQueries() {
  file = "query.json";
  let data = await fs.readFile(file, "utf-8");
  let queryList = JSON.parse(data);
  return queryList;
}

function sendQuery(index, queryList) {
  limit = queryList.length;
  return setInterval(() => {
    var server = getDesiredServer(
      queryList[index].Category,
      global.catTabletDict,
      global.tabMachineDict
    );
    query = queryList[index];
    op = query.operation;

    index += 1;
    console.log(`sending query number ${index}`);
    let tabNo = global.catTabletDict[query.Category];
    if (op == 1) {
      server.emit("addRow", tabNo, query);
    } else if (op == 2) {
      server.emit("deleteRow", tabNo, query);
    } else if (op == 3) {
      server.emit("read", tabNo, query);
    } else if (op == 4) {
      server.emit("set", tabNo, query);
    } else {
      server.emit("deleteCells", tabNo, query);
    }

    if (index == limit) {
      console.log("done signal");
      setTimeout(() => {
        process.exit();
      }, 1000);
    }
  }, 2000);
}
