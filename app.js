const express = require("express");
const mongoose = require('mongoose');
const _=require("lodash");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();
// let newItems = ["Cook Food", "Wash Clothers", "Bing Watch"];
// let WorkItems = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



mongoose.connect("mongodb+srv://Gautam_Sodhi:Noobcoder888@cluster0.obpadln.mongodb.net/todolistDB?retryWrites=true&w=majority");
const itemsSchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model('item', itemsSchema);
const item1 = new Item(
  {
    name: "Welcome to your to do List",
  }
);
const item2 = new Item(
  {
    name: "Hit + button to add an item",
  }
);
const item3 = new Item(
  {
    name: "<-- Hit this to delete an item",
  }
);
const defaultItems = [item1, item2, item3];
const listSchema={
  name: String,
  items: [itemsSchema],
}
const List=mongoose.model('List', listSchema);

app.get("/", function (req, res) {
  // const day=  date.getDate();
  // res.render("list", { Title: day, AddedItems: newItems });

  Item.find({}).then(function (items) {

     if (items.length===0){
      Item.insertMany(defaultItems).then(function () {
        console.log("Successfully saved default items to DB");
      }).catch(function (err) {
        console.log(err);
      });
      res.redirect("/");
     }
     else{
      res.render("list", { Title: "Today", AddedItems: items });
     }
  }).catch(function (err) {
    console.log(err);
  });
});
// app.get("/work", function (req, res) {
//   res.render("list", { Title: "Work List", AddedItems: WorkItems });
// })


app.get("/:customListName",function(req, res) {
    const customListName= _.capitalize(req.params.customListName);

    List.findOne({name:customListName}).then(function (foundItem) {
          if(!foundItem) {
            //here create a list
            const list= new List({
              name: customListName,
              items: defaultItems,
            });
            list.save();
            res.redirect("/"+customListName);
          }
         else{
          //here show existing list
          res.render("list", { Title: foundItem.name, AddedItems:foundItem.items });
         }
      })
      .catch(function (err) {
          console.log(err);
      });
});
app.post("/", function (req, res) {
  // let item = req.body.NewAddedItem;
  // if (req.body.list === "Work List") {
  //   WorkItems.push(item);
  //   res.redirect("/work");
  // }
  // else {
  //   newItems.push(item);
  //   res.redirect("/");
  // }

   const itemName= req.body.NewAddedItem;
   const listName=req.body.list;
   const newItem=new Item(
    {
      name: itemName,
    });
    if (listName==="Today") {
      newItem.save();
    res.redirect("/");
    }
    else{
      List.findOne({name: listName}).then(function (foundList) {
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/"+listName);
      }).catch(function(err){
        console.log(err);
      });
    }
});
app.post("/delete",function (req, res) {
   const checkedItemID=req.body.checkbox;
    const listName=req.body.listName;
     if(listName==="Today") {
      Item.findByIdAndRemove(checkedItemID).then(function () {
        console.log("Successfully deleted the item");
        res.redirect("/");
      }).catch(function (err) {
        console.log(err);
        });
     }

    else{
       List.findOneAndUpdate({name: listName},{$pull: {items: {_id:checkedItemID}}}).then(function () {
        res.redirect("/"+listName);
      }).catch(function (err) {
        console.log(err);
        });
    }

});
app.listen("3000", function () {
  console.log("Server is running on port 3000");
});