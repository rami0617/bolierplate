const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { User } = require("./models/Users");


//application/x-www-form-urlendcoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://rami:dkfka0216@cluster0.rbk9a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
}).then(() => console.log("🍊mongodb Connected"))
  .catch((err) => console.log(err));


app.get("/", (req, res) => {
    res.send("Hello world");
});


app.post("/register", (req, res) => {
  //회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body);
  user.save((err, doc) => {
    if(err) return res.json({success: flase, err});
    return res.status(200).json({
      success: true,
    })
  })
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});