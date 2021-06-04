const io = require("socket.io-client");
const socket = io.connect("http://localhost:3000");
const server1socket = io.connect("http://localhost:3001");
const server2socket = io.connect("http://localhost:3002");
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
  });
   
socket.on("connect", () => {
  console.log(`you connected with ${socket.id}`);
});

socket.emit("client");
socket.on("client-welcome", (id) => {
  console.log(`my Id is ${id}`);
  clientId = id;
  console.log("done");
});

server1socket.on("connect", () => {
  console.log("connected with el server el 5wl rakam 1");
});
server2socket.on("connect", () => {
  console.log("connected with el server el 5wl rakam 2");
});

function GetUserQuery()
{
	readline.question('Enter *Query#*: 1)addRow 2)deleteRow 3)Read 4)Set 5)deleteCells *Category* *App Name* \n', input => {
		const inp = input.split(' ')
		Query = inp[0]
		cat = inp[1]
		appName = inp[2]
		// Todo find the desired server through metadata using category to decide to use server1socket or server2socket
		server = getDesiredServer(cat)
		if(Query == 1)
		{
			server.emit('addRow')
		}
		else if(Query == 2)
		{
			server.emit('deleteRow')
		}
		else if(Query == 3)
		{
			server.emit('read')
		}
		else if(Query == 4)
		{
			server.emit('set')
		}
		else
		{
			server.emit('deleteCells')
		}
		readline.close();
	  });
}
function getDesiredServer(cat)
{
	return server1socket;
}