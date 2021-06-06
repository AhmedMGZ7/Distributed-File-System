const mongoose = require("mongoose");


module.exports.connect = function (host, dbName) {
	url = `mongodb://${host}:27017/${dbName}`;
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to mongoose");
  })
  .catch((err) => {
    console.log(err);
  });
}