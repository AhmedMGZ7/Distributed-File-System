const mongo = require('mongodb');


const csvtojson = require("csvtojson");

csvtojson()
  .fromFile("googleplaystore.csv")
  .then(csvData => {
    var url = "mongodb://localhost:27017/mydb";

    mongo.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("GoogleApps");
    dbo.createCollection("apps", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
    });
    dbo.collection("apps").insertMany(csvData, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
      });
    })
});
