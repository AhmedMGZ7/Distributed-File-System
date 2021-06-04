const io = require("socket.io")(3000);
const mongoose = require("mongoose");
const { set, deleteCells, deleteRow, addRow, read } = require('./queries')
// , {
	// 	cors: {
		// 	  origin: ["http://localhost:8080"],
		// 	},
		//   }
		
url = "mongodb://localhost:27017/GoogleApps";
mongoose
.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
	console.log("connected to mongoose");
})
.catch((err) => {
	console.log(err);
});

// set("ART_AND_DESIGN$Photo Editor & Candy Camera & Grid & ScrapBook", {'Android Ver':"messi"})
read("ART_AND_DESIGN$Coloring book moana")
// deleteRow("ART_AND_DESIGN$Photo Editor & Candy Camera & Grid & ScrapBook")
// addRow("ART_AND_DESIGN$Photo Editor & Candy Camera & Grid & ScrapBook",
// {
//     App: 'Photo Editor & Candy Camera & Grid & ScrapBook',
//     Category: 'ART_AND_DESIGN',
//     Rating: '4.1',
//     Reviews: '159',
//     Size: '19M',
//     Installs: '10,000+',
//     Price: 'bala7',
//     'Content Rating': 'Everyone',
//     Genres: 'Art & Design',
//     'Last Updated': 'January 7, 2018',
//     'Current Ver': '1.0.0',
//     'Android Ver': 'messi'
//   })

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
    socket.emit("tablet-welcome", i, servers[i].tablets, servers[i].port);
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
