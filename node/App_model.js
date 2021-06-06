const mongoose = require("mongoose");
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);


const schema = new mongoose.Schema({
  App: {
    type: String,

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

    maxlength: 255,
  },
  Reviews: {
    type: String,

    maxlength: 255,
  },
  Size: {
    type: String,

    maxlength: 255,
  },
  Installs: {
    type: String,

    maxlength: 255,
  },
  Type: {
    type: String,

    maxlength: 255,
  },
  Price: {
    type: String,

    maxlength: 255,
  },
  "Content Rating": {
    type: String,

    maxlength: 255,
  },
  Genres: {
    type: String,

    maxlength: 255,
  },
  "Last Updated": {
    type: String,

    maxlength: 255,
  },
  "Current Ver": {
    type: String,

    maxlength: 255,
  },
  "Android Ver": {
    type: String,

    maxlength: 255,
  },
});

const App = mongoose.model("App", schema);

module.exports.App = App;
