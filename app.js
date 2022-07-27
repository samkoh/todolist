//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const _ = require("lodash");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//(1) Mongoose connection setting
const mongoose = require("mongoose");
//Mongoose connection setting-LOCALHOST
//mongoose.connect('mongodb://localhost:27017/listItemDB', { useNewUrlParser: true });

//Mongoose connection setting-PROD
mongoose.connect('mongodb+srv://dbenvtest:test123@cluster0.evqqz.mongodb.net/todolistDB', { useNewUrlParser: true });

//(2) Create database Schema
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "This is required field"]
    }
});

//(3) Create database model
const Item = mongoose.model("Item", itemSchema);

//Default Data collection
const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

//Put the default data collection into an array
const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);


//Declare items (This is for hardcode array variable)
let items = [];
//let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

const day = date.getDate();

app.get("/", function (req, res) {

    //var currentDay = today.getDay();
    //var day = "";

    //if (currentDay === 6 || currentDay === 0) {
    //res.send("<h1>Yay it's the weekend</h1>");
    //day = "Weekend";
    // }
    // else {
    //res.write("<p>It is not the weekend</p>");
    //res.write("<h1>Boo! I have to work!</h1>");
    //res.sendFile(__dirname + "/index.html");
    // day = "Weekday";
    //}

    //switch (currentDay) {
    //case 0:
    //day = "Sunday";
    //break;
    //case 1:
    //day = "Monday";
    //break;
    //case 2:
    //day = "Tuesday";
    //break;
    //case 3:
    //day = "Wednesday";
    //break;
    //case 4:
    //day = "Thursday";
    //break;
    //case 5:
    //day = "Friday";
    //break;
    //case 6:
    //day = "Saturday";
    //break;
    //default:
    //console.log("Error: current day is equal to: " + currentDay);
    //}




    //Select/Find Records
    //This is find all and will return a list of array
    Item.find({}, function (err, itemsList) {
        //Since it returns an array, that is why we need to check the data based on the length
        if (itemsList.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfullt saved default items to DB.")
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: day, newListItem: itemsList });
        }
    });
});
app.post("/", function (req, res) {
    const item = req.body.newItems;
    const listName = req.body.list;
    console.log(listName);

    const list = new Item({
        name: item
    });

    if (listName === day) {
        list.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(list);
            foundList.save();
            res.redirect("/" + listName);
        });
    }




    // if (req.body.list === 'Work') {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    //     //items.push(item);
    //     const list = new Item({
    //         name: item
    //     });
    //     list.save();
    //     res.redirect("/");
    // }
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === day) {
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                console.log("Successfully deleted checked item");
            }
        });
        res.redirect("/");
    } else {
        //Find One record and update from the listName. Then pull from the array where _id = checkedItemId
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }
});

// app.get("/work", function (req, res) {
//     res.render("list", { listTitle: "Work List", newListItem: workItems });
// });

app.get("/:customListName", function (req, res) {
    //Lodash - First letter captal letter, the rest are small capital
    const customListName = _.capitalize(req.params.customListName);

    //Find on record and will return an object insteads of an array
    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                ///Create a new List
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                //Show an existing list
                res.render("list", { listTitle: foundList.name, newListItem: foundList.items });
            }
        }
    });
});


app.listen(3000, function () {
    console.log("Server started on port 3000");
});