const {server1socket,server2socket} = require("./client")


const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

 
  console.log(server1socket)

  module.exports.getUserQuery = function getUserQuery(catTabletDict,tabMachineDict) {
    let strArr = ["appName","categ","Rating","Reviews","Size","Installs","Type","Price","Content_Rating","Genres","Last_Updated","Current_Ver","Android_Ver"];
    let inpArr = []
    var op = -1;
    readline.question(
    "Enter OP#: 1)addRow 2)deleteRow 3)Read 4)Set 5)deleteCells)",
            (input) => {
                op = parseInt(input)
				console.log(op)
                readline.close();
        }
        );
	console.log(input)
    if(op == 1 || op == 4)
    {
        for (let i =0 ; i < arr.length; i++)
        {
            readline.question(
            `Enter ${strArr[i]} or -1 : `,
            (input) => {
                inpArr.append(input);
                readline.close();
                }
            );
        }
    }
    if(op != -1)
    {
        i = 0
        obj = {}
        inpArr.forEach(inp => {
            if (inp != "-1") {
            obj[strArr[i]] = inp
            }
            i+=1
        })
        server = getDesiredServer(obj[strArr[1]],catTabletDict,tabMachineDict);
        rowKey = catTabletDict[obj[strArr[0]]]+'$'+catTabletDict[obj[strArr[1]]]
        if (op == 1) {
            server.emit("addRow",rowKey,catTabletDict[obj[strArr[1]]],obj);
        } else if (op == 2) {
            server.emit("deleteRow",rowKey,catTabletDict[obj[strArr[1]]]);
        } else if (op == 3) {
            server.emit("read",rowkey,catTabletDict[obj[strArr[1]]]);
        } else if (op == 4) {
            server.emit("set",rowKey,catTabletDict[obj[strArr[1]]],obj);
        } else if(op == 5){
            server.emit("deleteCells",rowkey,catTabletDict[obj[strArr[1]]], obj);
        }
    }
    
};

function getDesiredServer(cat,catTabletDict,tabMachineDict) {
    return (tabMachineDict[catTabletDict[cat]]) == 0 
      ? server1socket
      : server2socket;
  }yyyyyyyyyyyyyyyyyyy