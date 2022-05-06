const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://rami:dkfka0216@cluster0.rbk9a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
}).then(() => console.log("🍊mongodb Connected"))
  .catch((err) => console.log(err));


app.get("/", (req, res) => {
    res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});