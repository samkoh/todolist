// const mongoose = require("mongoose");
// //Mongoose connection setting
// mongoose.connect('mongodb://localhost:27017/listItemDB', { useNewUrlParser: true });

// //Create database Schema
// const itemSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "This is required field"]
//     }
// });

// //Create database model
// const Item = mongoose.model("Item", itemSchema);

// //Data collection
// // const item1 = new Item({
// //     name: "Buy Food"
// // });

// // const item2 = new Item({
// //     name: "Cook Food"
// // });

// // const item3 = new Item({
// //     name: "Eat Food"
// // });

// // //Insert Many records
// // Item.insertMany([item1, item2, item3], function (err) {
// //     if (err) {
// //         console.log(err);
// //     } else {
// //         console.log("Records have been inserted successfully.");
// //     }
// // });

// //Delete Many records
// Item.deleteMany({ name: "5" }, function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Deleted");
//     }
// });

// //Select/Find Records
// // Item.find(function (err, items) {
// //     if (err) {
// //         console.log(err);
// //     } else {
// //         items.forEach(function (f) {
// //             console.log(f.name);
// //         });
// //     }
// // });