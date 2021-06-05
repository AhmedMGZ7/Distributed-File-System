const io = require("socket.io-client");
const socket = io.connect("http://localhost:3000");
const server1socket = io.connect("http://localhost:3001");
const server2socket = io.connect("http://localhost:3002");
const {getUserQuery} = require("./userInput");

// meta data - data structures
var catTabletDict = {};
var tabMachineDict = [];

socket.on("connect", () => {
  console.log(`you connected with ${socket.id}`);
});

socket.emit("client");
socket.on("client-welcome", (id) => {
  console.log(`my Id is ${id}`);
  clientId = id;
  console.log("done");
});

socket.on("meta", (catTabletDict, tabMachineDict) => {
	global.catTabletDict = catTabletDict;
	global.tabMachineDict = tabMachineDict;
  console.log(global.catTabletDict, global.tabMachineDict)
  
  getUserQuery(catTabletDict,tabMachineDict)
  
});

server1socket.on("connect", () => {
  console.log("connected with server 1");
});
server2socket.on("connect", () => {
  console.log("connected with server 2");
});


// function GetUserQuery() {
//   readline.question(
//     "Enter *Query#*: 1)addRow 2)deleteRow 3)Read 4)Set 5)deleteCells *Category* *App Name* \n",
//     (input) => {
//       const inp = input.split(" ");
//       Query = inp[0];
//       cat = inp[1];
//       appName = inp[2];
//       // Todo find the desired server through metadata using category to decide to use server1socket or server2socket
//       server = getDesiredServer(cat);
//       if (Query == 1) {
//         server.emit("addRow");
//       } else if (Query == 2) {
//         server.emit("deleteRow");
//       } else if (Query == 3) {
//         server.emit("read");
//       } else if (Query == 4) {
//         server.emit("set");
//       } else {
//         server.emit("deleteCells");
//       }
//       readline.close();
//     }
//   );
// }

// function getDesiredServer(cat) {
//   return (global.tabMachineDict[global.catTabletDict[cat]]) == 0 
//     ? server1socket
//     : server2socke
exports.server1socket=server1socket;
exports.server2socket=server2socket;