const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  App: {
    type: String,
    minlength: 1,
    maxlength: 255,
    unique: true,
    validate: {
      validator: (v) => {
        if (v.includes("$")) return false;
      },
      message: "Can't contain $",
    },
  },
  Category: {
    type: String,
    minlength: 1,
    maxlength: 255,
    validate: {
      validator: (v) => {
        if (v.includes("$")) return false;
      },
      message: "Can't contain $",
    },
  },
  Rating: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  Reviews: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  Size: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  Installs: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  Type: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  Price: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  "Content Rating": {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  Genres: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  "Last Updated": {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  "Current Ver": {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  "Android Ver": {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
});

const App = mongoose.model("App", schema);

module.exports.App = App;
