const App = require('./App_model')
const mongoose = require("mongoose");
const { find } = require('./App_model');


module.exports.set = async function set(row_key, obj) {
	let [cat, name] = row_key.split('$')
	console.log(cat, name)
	let app = await App.findOneAndUpdate({ Category: cat, App: name }, obj)
	
	app = await App.find({App:name})
	console.log(app)
}
module.exports.deleteCells = async function deleteCells(row_key, columns) {
	let [cat, name] = row_key.split('$')
	var obj = {}
	columns.forEach(element => {
		obj[element] = ''
	});
	columns.reduce((acc, curr) => (acc[curr] = '', acc), {})
	console.log(obj)
	let app = await App.findOneAndUpdate({ Category: cat, App: name }, { $unset: obj})
	
	app = await App.find({App:name})
	console.log(app)
}

module.exports.deleteRow = async function deleteRow(row_key) {
	let [cat, name] = row_key.split('$')
	console.log(cat, name)
	await App.findOneAndDelete({ Category: cat, App: name })
}

module.exports.read = async function read(row_key) {
	let [cat, name] = row_key.split('$')
	console.log(cat, name)
	let app = await App.find({ Category: cat, App: name })
    console.log(app)
}

module.exports.addRow = async function addRow(row_key, obj) {
	let [cat, name] = row_key.split('$')
	console.log(cat, name)
	let app = await App.create(obj)
    console.log(app)
}

// set("ART_AND_DESIGN.Photo Editor & Candy Camera & Grid & ScrapBook", {})