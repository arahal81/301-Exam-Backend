const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const axios = require("axios");
require("dotenv").config();
const mongoose = require("mongoose");
app.use(express.json());
mongoose.connect(`${process.env.MONGO_DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const drinkSchema = new mongoose.Schema({
  strDrink: String,
  strDrinkThumb: String,
});
const DrinkModel = mongoose.model("Drink", drinkSchema);

app.get("/", function (req, res) {
  res.send("Hello World");
});
app.get("/api", getApiData);
app.get("/fav", getFav);
app.post("/fav", addToFav);
app.delete("/fav", deleteFav);
app.put("/fav", updateFav);

app.listen(process.env.PORT);

function addToFav(req, res) {
  console.log(req.body);
  const { strDrink, strDrinkThumb } = req.body;
  const newFav = new DrinkModel({
    strDrink: strDrink,
    strDrinkThumb: strDrinkThumb,
  });
  newFav.save();
}

function getFav(req, res) {
  DrinkModel.find({}, (err, data) => {
    // console.log(data);
    res.send(data);
  });
}
function updateFav(req, res) {
  const { id, strDrink } = req.body;
  DrinkModel.findone({ _id: id }, (err, data) => {
    data.strDrink = strDrink;
    data.save();
  });
}

function deleteFav(req, res) {
  const id = req.params;
  console.log(id);
  DrinkModel.deleteOne({ _id: id }, (err, data) => {
    console.log(data);
  }).then((data) => {
    res.send(data.data);
  });
}

function getApiData(req, res) {
  console.log("done");
  axios
    .get(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`
    )
    .then((data) => {
      res.send(data.data);
    });
}
