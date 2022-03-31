
const express = require("express")
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const mongoose = require("mongoose");

const app = express();
 //const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connection is established
mongoose.connect("mongodb+srv://admin-ashu:Test123@cluster0.khsc4.mongodb.net/todolistDB");

//Schema is created
const itemsSchema = {
    name: String
};

//Module is created
const Item = mongoose.model("Item", itemsSchema);

//Creating Document
const item1 = new Item({
    name: "Welcome..."
});

const item2 = new Item({

    name: "Hit (+) button to add new item."
});

const defaultItems = [item1, item2];



app.get("/", function(req, res){

    //Searching all items
    Item.find({}, function(err, foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully saved default items to databse.")
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }

    });

    

});

app.post("/", function(req, res){

    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

   item.save();
   res.redirect("/");
    
});

app.post("/delete", function(req, res){

    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function(err){

        if(!err){
            console.log("Successfully Deleted...")
            res.redirect("/");
        }
    });
});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/work", function(req, res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.listen(3000, function(){

    console.log("Server started at Port 3000");

});