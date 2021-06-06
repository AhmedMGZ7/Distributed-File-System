const io = require("socket.io-client");
const socket = io.connect("http://localhost:3000");
const server1socket = io.connect("http://localhost:3001");
const server2socket = io.connect("http://localhost:3002");
// const {getUserQuery} = require("./userInput");
// const prompt = require("prompt");
const fs = require("fs").promises;

// meta data - data structures
var catTabletDict = {};
var tabMachineDict = [];

//set Interval ID 
setIntervalId = -1
// current query
index = 0;
var queryList;
async function getQueryList(){
	queryList = await getUserQueries();
}
getQueryList()

socket.on("connect", () => {
  console.log(`you connected with ${socket.id}`);
  socket.emit("client");
});

socket.on('start', async () => {
	setIntervalId = sendQuery(index, queryList)
})

socket.on("meta", async (catTabletDict, tabMachineDict) => {
  global.catTabletDict = catTabletDict;
  global.tabMachineDict = tabMachineDict;
});

socket.on('stop', () => {
	clearInterval(setIntervalId)
})

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




function getDesiredServer(cat, catTabletDict, tabMachineDict) {
	let bool = tabMachineDict[catTabletDict[cat]] == 0
	return bool
    ? server1socket
    : server2socket;
}

async function getUserQueries() {
  file = "query.json";
  let data = await fs.readFile(file, "utf-8");
  let queryList = JSON.parse(data);
  return queryList
}

function sendQuery(index, queryList) {
	limit = queryList.length;
	return setInterval(() => {
		var server = getDesiredServer(queryList[index].Category, global.catTabletDict, global.tabMachineDict);
		query = queryList[index]
		op = query.operation;
		
		console.log(index, op)
		index += 1;
		let tabNo = global.catTabletDict[query.Category]
		if (op == 1) {
			server.emit("addRow", tabNo, query);
		} else if (op == 2) {
			server.emit("deleteRow", tabNo, query);
		} else if (op == 3) {
			console.log("reaaaaaaaaaaaad")
			server.emit("read", tabNo, query);
		} else if (op == 4) {
			server.emit("set", tabNo, query);
		} else {
			server.emit("deleteCells", tabNo, query);
		}

		if (index == limit) {
			console.log("done signal from vlsi project");
			setTimeout(() => {process.exit()}, 1000) 
		}
	}, 2000);
}

